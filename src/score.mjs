import { readFileSync } from 'node:fs'

const RUBRIC = JSON.parse(readFileSync(new URL('../rubric.json', import.meta.url), 'utf8'))
const configuredTotal = RUBRIC.dimensions.reduce((sum, item) => sum + item.points, 0)
if (configuredTotal !== RUBRIC.totalPoints) throw new Error(`rubric total mismatch: configured ${RUBRIC.totalPoints}, dimensions ${configuredTotal}`)
const D = Object.fromEntries(RUBRIC.dimensions.map(item => [item.id, item.name]))
const VALUE = Object.fromEntries(Object.entries(RUBRIC.statuses).filter(([, value]) => typeof value === 'number'))
const RUNTIME_STATUSES = new Set(['PASS', 'PARTIAL', 'FAIL', 'UNPROVEN'])
const EVIDENCE_LEVELS = new Set(['E0', 'E1', 'E2', 'E3', 'E4', 'E5'])
const LEVEL_RANK = { E0: 0, E1: 1, E2: 2, E3: 3, E4: 4, E5: 5 }
const RUNTIME_MIN_LEVEL = RUBRIC.runtimeMinimumEvidence
const IDENTITY_LABELS = new Set(RUBRIC.identityLabels)

function check(id, dimension, points, status, level, summary, evidence = []) {
  return { id, dimension, dimensionName: D[dimension], points, status, level, summary, evidence }
}

function runtimeStatus(runtime, id) {
  const value = runtime?.checks?.[id] || null
  return value?.status === 'UNPROVEN' ? null : value
}

function hasRuntimeObservation(value) {
  return value?.status === 'UNPROVEN' && typeof value.summary === 'string' && value.summary.trim() &&
    Array.isArray(value.evidence) && value.evidence.length > 0 && value.evidence.every(item => typeof item === 'string' && item.trim())
}

function runtimeOverride(runtime, fallback) {
  const value = runtime?.checks?.[fallback.id] || null
  if (!value || (value.status === 'UNPROVEN' && (fallback.status !== 'UNPROVEN' || !hasRuntimeObservation(value)))) return fallback
  return check(fallback.id, fallback.dimension, fallback.points, value.status, value.level, value.summary, value.evidence || [])
}

function runtimeCheck(runtime, id, dimension, points, fallbackSummary) {
  return runtimeOverride(runtime, check(id, dimension, points, 'UNPROVEN', 'E0', fallbackSummary))
}

function appliesToCode(inspect) {
  return inspect.types.includes('bundle') || inspect.types.includes('native-plugin')
}

function grade(score) {
  if (score >= 90) return '卓越'
  if (score >= 80) return '强推荐'
  if (score >= 70) return '可用，有明确取舍'
  if (score >= 60) return '能力有限或风险较多'
  return '不推荐'
}

function capScore(value, cap) {
  return Math.min(value, cap)
}

function validateRuntime(runtime, metadata) {
  if (!runtime) return
  if (!runtime.checks || typeof runtime.checks !== 'object' || Array.isArray(runtime.checks)) {
    throw new Error('runtime evidence must contain a checks object')
  }
  if (!/^[0-9a-f]{40}$/i.test(metadata.commit || '')) throw new Error('runtime evidence requires an inspected full 40-character git commit')
  if (!/^[0-9a-f]{40}$/i.test(runtime.targetCommit || '')) throw new Error('runtime evidence requires a full 40-character targetCommit')
  if (metadata.commit !== runtime.targetCommit) throw new Error(`runtime evidence commit ${runtime.targetCommit} does not match inspected commit ${metadata.commit}`)
  if (runtime.targetArtifact !== (metadata.artifact || '.')) throw new Error(`runtime evidence artifact ${runtime.targetArtifact || 'missing'} does not match inspected artifact ${metadata.artifact || '.'}`)
  let requiresRuntimeEnvironment = false
  for (const [id, raw] of Object.entries(runtime.checks)) {
    if (!Object.hasOwn(RUNTIME_MIN_LEVEL, id)) throw new Error(`unknown runtime check id: ${id}`)
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error(`runtime check ${id} must be an object`)
    const value = raw
    if (!value || !RUNTIME_STATUSES.has(value.status)) throw new Error(`invalid runtime status for ${id}`)
    if (!EVIDENCE_LEVELS.has(value.level)) throw new Error(`invalid evidence level for ${id}`)
    if (value.status === 'UNPROVEN' && value.evidence !== undefined && !Array.isArray(value.evidence)) throw new Error(`${id} evidence must be an array`)
    if (value.status === 'UNPROVEN' && Array.isArray(value.evidence) && value.evidence.length > 0 && !hasRuntimeObservation(value)) {
      throw new Error(`${id} observed UNPROVEN requires a summary and non-empty string evidence records`)
    }
    if (value.status !== 'UNPROVEN' && LEVEL_RANK[value.level] < LEVEL_RANK[RUNTIME_MIN_LEVEL[id]]) {
      throw new Error(`${id} requires ${RUNTIME_MIN_LEVEL[id]} or stronger evidence`)
    }
    if (value.status !== 'UNPROVEN' && (typeof value.summary !== 'string' || !value.summary.trim())) throw new Error(`${id} requires a summary`)
    if (value.status !== 'UNPROVEN' && (!Array.isArray(value.evidence) || value.evidence.length === 0 || value.evidence.some(item => typeof item !== 'string' || !item.trim()))) {
      throw new Error(`${id} requires non-empty string evidence records`)
    }
    if ((value.status !== 'UNPROVEN' || hasRuntimeObservation(value)) && LEVEL_RANK[value.level] >= LEVEL_RANK.E3) requiresRuntimeEnvironment = true
  }
  if (requiresRuntimeEnvironment) {
    const env = runtime.environment
    if (!env || typeof env !== 'object' || ![env.dsh, env.node, env.os, env.profile].every(value => typeof value === 'string' && value.trim()) || env.isolatedDshHome !== true) {
      throw new Error('E3+ runtime evidence requires non-empty environment.dsh/node/os/profile and isolatedDshHome=true')
    }
  }
}

export function scoreInspection(inspect, metadata = {}, runtime = null) {
  if (!IDENTITY_LABELS.has(metadata.identity || 'UNPROVEN')) throw new Error(`invalid identity label: ${metadata.identity}`)
  validateRuntime(runtime, metadata)
  const evaluatedAt = metadata.evaluatedAt || new Date().toISOString()
  if (!Number.isFinite(Date.parse(evaluatedAt))) throw new Error(`invalid evaluatedAt: ${evaluatedAt}`)
  const realArtifact = inspect.types.some(type => ['bundle', 'native-plugin', 'skill', 'preset'].includes(type))
  const codePlugin = appliesToCode(inspect)
  const uiPlugin = codePlugin && /(?:client|web[- ]?ui|sidebar|theme|skin|vue|react|css)/i.test(inspect.sourceText + inspect.readme)
  const stateful = /(?:storage|persist|database|sqlite|session|memory|cache)/i.test(inspect.sourceText + inspect.readme)
  const primaryPackage = inspect.packages.find(item => item.path === 'package.json')?.value || {}
  const deps = { ...(primaryPackage.dependencies || {}), ...(primaryPackage.peerDependencies || {}) }
  const dshDeps = Object.entries(deps).filter(([name]) => name === '@deepseek-ai/cordis' || name.startsWith('@deepseek-ai/dsh-'))
  const externalDshRanges = dshDeps.filter(([, range]) => typeof range === 'string' && !range.startsWith('workspace:'))
  const installScripts = inspect.allPackageScripts.filter(([name]) => ['preinstall', 'install', 'postinstall', 'prepare'].includes(name))
  const riskyInstallScript = installScripts.some(([, command]) => /(?:curl|wget|sudo|\beval\b|powershell\s+-enc|rm\s+-rf)/i.test(command))
  const readme = inspect.readme
  const checks = []

  checks.push(check('function.promise', 'function', 4,
    readme.length >= 300 && /(?:what it does|features|功能|能力|usage|使用)/i.test(readme) ? 'PASS' : readme.length ? 'PARTIAL' : 'UNPROVEN',
    'E1', '核心用途与主路径是否具体可核查', inspect.readmePath ? [inspect.readmePath] : []))
  checks.push(runtimeOverride(runtime, check('function.automated-tests', 'function', 5,
    inspect.hasTests ? 'PARTIAL' : codePlugin ? 'FAIL' : 'N/A', 'E1', inspect.hasTests ? `静态发现 ${inspect.testPaths.length} 个测试文件；未提交 E2 执行结果` : '未发现自动化测试', inspect.testPaths.slice(0, 5))))
  checks.push(runtimeCheck(runtime, 'function.core-path', 'function', 8, '尚无真实用户主路径和最终结果证据'))
  checks.push(runtimeCheck(runtime, 'function.negative-path', 'function', 3, '尚无受支持失败路径的真实运行证据'))

  const bundleInstallDocumented = /dsh\s+plugin(?:\s+--profile\s+\S+)?\s+add|dsh\s+plugin\s+--profile\s+\S+\s+add/i.test(readme)
  const textArtifactInstallDocumented = /(?:install|copy|clone|use|安装|复制|使用|启用)/i.test(readme)
  const installDocumented = inspect.types.includes('bundle') ? bundleInstallDocumented : textArtifactInstallDocumented
  checks.push(check('install.documentation', 'install', 3,
    installDocumented ? 'PASS' : 'FAIL', 'E1', installDocumented ? 'README 提供与 artifact 类型匹配的安装/启用说明' : '未发现与 artifact 类型匹配的安装/启用说明', inspect.readmePath ? [inspect.readmePath] : []))
  const patchesOk = inspect.bundlePatchResolution.length > 0 && inspect.bundlePatchResolution.every(item => item.exists)
  checks.push(check('install.manifest', 'install', 3,
    inspect.types.includes('bundle') ? (patchesOk ? 'PASS' : 'FAIL') : realArtifact ? 'N/A' : 'FAIL', 'E1', inspect.types.includes('bundle') ? (patchesOk ? 'dsh.bundle.patch 均可解析' : 'dsh.bundle.patch 指向缺失文件') : '该类型不使用 bundle patch', inspect.bundlePatchResolution.map(item => item.expected)))
  checks.push(runtimeCheck(runtime, 'install.clean-profile', 'install', 3, '尚未在隔离 DSH_HOME 执行干净安装'))
  checks.push(runtimeCheck(runtime, 'install.restart-remove', 'install', 3, '尚未验证重启激活与卸载清理'))

  checks.push(check('integration.public-seam', 'integration', 3,
    inspect.types.includes('skill') || inspect.types.includes('preset') ? 'PASS' : dshDeps.length > 0 ? 'PASS' : codePlugin ? 'PARTIAL' : 'N/A', 'E1', dshDeps.length ? `声明 ${dshDeps.length} 个 DSH/Cordis 依赖` : '未从包依赖确认官方扩展接口', dshDeps.map(([name, range]) => `${name}@${range}`)))
  checks.push(check('integration.version-range', 'integration', 3,
    externalDshRanges.length > 0 ? 'PASS' : codePlugin ? 'PARTIAL' : 'N/A', 'E1', externalDshRanges.length ? '声明外部 DSH/Cordis 版本范围' : '未确认可发布物的兼容版本范围', externalDshRanges.map(([name, range]) => `${name}@${range}`)))
  checks.push(check('integration.lifecycle', 'integration', 3,
    !codePlugin || !inspect.hasUnmanagedResource ? 'N/A' : 'PARTIAL', 'E1', !inspect.hasUnmanagedResource ? '未发现需额外管理的 timer/watcher/server 资源' : inspect.hasLifecycleCleanup ? '静态发现长期资源与清理形状；未证明两者生命周期关联' : '发现长期资源但未静态确认 disposer'))
  checks.push(check('integration.config-validation', 'integration', 2,
    !codePlugin ? 'N/A' : /(?:zod|schemastery|Schema\.|safeParse|parse\()/i.test(inspect.sourceText) ? 'PASS' : 'PARTIAL', 'E1', '配置是否在最早可判断处校验'))
  checks.push(runtimeCheck(runtime, 'integration.compose-hmr', 'integration', 2, '尚未验证与 baseline 共存、HMR 或卸载生命周期'))

  checks.push(runtimeOverride(runtime, check('reliability.error-tests', 'reliability', 3,
    !codePlugin ? 'N/A' : /rejects|toThrow|invalid|error|fail/i.test(inspect.testText) ? 'PARTIAL' : inspect.hasTests ? 'PARTIAL' : 'UNPROVEN', 'E1', '静态测试形状不能证明错误或无效输入测试已执行')))
  const hasTimeoutFeature = /(timeout|cancel|abort|signal)/i.test(inspect.sourceText + readme)
  checks.push(runtimeOverride(runtime, check('reliability.timeout-cancel', 'reliability', 2,
    !hasTimeoutFeature ? 'N/A' : /(timeout|cancel|abort|signal)/i.test(inspect.testText) ? 'PARTIAL' : 'UNPROVEN', 'E1', '静态测试形状不能证明取消或超时路径已执行')))
  checks.push(runtimeCheck(runtime, 'reliability.repeat-run', 'reliability', 3, '尚未验证重复运行的稳定性'))
  checks.push(stateful
    ? runtimeCheck(runtime, 'reliability.state-restart', 'reliability', 4, '检测到状态能力，但尚未验证重启/部分失败后的完整性')
    : check('reliability.state-restart', 'reliability', 4, 'N/A', 'E1', '未检测到持久状态承诺'))

  checks.push(check('security.license', 'security', 2, inspect.hasLicense ? 'PASS' : 'FAIL', 'E1', inspect.hasLicense ? '发现许可证声明' : '未发现许可证'))
  checks.push(check('security.embedded-secret', 'security', 3,
    inspect.embeddedSecrets.length ? 'FAIL' : inspect.sourceFileCount ? 'PASS' : 'UNPROVEN', 'E1', inspect.embeddedSecrets.length ? '源码疑似包含长效凭证' : inspect.sourceFileCount ? '未在运行源码中发现常见长效凭证字面量' : 'artifact 中没有可扫描的运行源码', inspect.embeddedSecrets))
  checks.push(check('security.install-scripts', 'security', 3,
    riskyInstallScript ? 'FAIL' : installScripts.length ? (/prepare|build|allowBuilds|安装脚本|postinstall/i.test(readme) ? 'PASS' : 'PARTIAL') : 'PASS', 'E1', installScripts.length ? `安装期脚本：${installScripts.map(([name]) => name).join(', ')}` : '无安装期脚本', installScripts.map(([name, command]) => `${name}: ${command}`)))
  checks.push(check('security.network-credentials', 'security', 3,
    !inspect.hasNetworkCode && !inspect.hasCredentialCode ? 'N/A' : /(?:API.?key|token|credential|privacy|network|联网|凭证|密钥|隐私|遥测)/i.test(readme) ? 'PASS' : 'PARTIAL', 'E1', '网络、凭证与遥测行为是否披露'))
  checks.push(runtimeCheck(runtime, 'security.permission-scope', 'security', 4, '尚未以真实运行观察权限、网络和写入范围'))
  const majorUndisclosed = runtimeStatus(runtime, 'security.major-undisclosed')
  const observedMajorUndisclosed = runtime?.checks?.['security.major-undisclosed']
  checks.push(majorUndisclosed
    ? check('security.major-undisclosed', 'security', 0, majorUndisclosed.status, majorUndisclosed.level, majorUndisclosed.summary, majorUndisclosed.evidence)
    : hasRuntimeObservation(observedMajorUndisclosed)
      ? check('security.major-undisclosed', 'security', 0, 'UNPROVEN', observedMajorUndisclosed.level, observedMajorUndisclosed.summary, observedMajorUndisclosed.evidence)
    : check('security.major-undisclosed', 'security', 0, 'N/A', 'E0', '未提交重大未披露越界行为 gate 证据'))

  checks.push(runtimeCheck(runtime, 'performance.startup-idle', 'performance', 4, '尚无相对 baseline 的启动与空闲资源增量'))
  checks.push(runtimeCheck(runtime, 'performance.main-path', 'performance', 4, '尚无主路径延迟、内存、网络或 token 增量'))

  checks.push(check('ux.readme-config', 'ux', 3,
    readme.length >= 800 && /(?:config|configuration|配置|settings|usage|使用)/i.test(readme) ? 'PASS' : readme.length ? 'PARTIAL' : 'FAIL', 'E1', 'README 是否覆盖安装、配置和使用'))
  checks.push(check('ux.actionable-errors', 'ux', 2,
    !codePlugin ? 'N/A' : /throw new|new Error|logger\.(?:warn|error)|console\.error/i.test(inspect.sourceText) ? 'PARTIAL' : 'UNPROVEN', 'E1', '错误是否能指导用户下一步'))
  checks.push(runtimeCheck(runtime, 'ux.visible-result', 'ux', 3, '尚无用户可见兑现证据'))
  checks.push(uiPlugin
    ? runtimeCheck(runtime, 'ux.ui-layout', 'ux', 2, '检测到 UI 能力，但尚未验证桌面/移动与关键交互')
    : check('ux.ui-layout', 'ux', 2, 'N/A', 'E1', '非 UI 插件'))

  const scripts = new Map(inspect.allPackageScripts)
  const qualityScripts = ['test', 'typecheck', 'lint', 'check'].filter(name => scripts.has(name))
  checks.push(runtimeOverride(runtime, check('engineering.verification', 'engineering', 4,
    inspect.hasTests && inspect.hasCi && qualityScripts.length ? 'PASS' : inspect.hasTests || inspect.hasCi || qualityScripts.length ? 'PARTIAL' : 'FAIL', 'E1', `tests=${inspect.hasTests}, ci=${inspect.hasCi}, scripts=${qualityScripts.join(',') || 'none'}`)))
  checks.push(check('engineering.release', 'engineering', 2,
    inspect.hasLockfile && inspect.hasChangelog ? 'PASS' : inspect.hasLockfile || inspect.hasChangelog ? 'PARTIAL' : 'FAIL', 'E1', `artifact lockfile=${inspect.hasLockfile}, artifact changelog=${inspect.hasChangelog}`))
  checks.push(check('engineering.support', 'engineering', 2,
    inspect.hasSecurityPolicy ? 'PASS' : inspect.hasLicense ? 'PARTIAL' : 'FAIL', 'E1', `security policy=${inspect.hasSecurityPolicy}, license=${inspect.hasLicense}`))
  const commitAt = metadata.commitAt ? Date.parse(metadata.commitAt) : NaN
  const evaluationTime = Date.parse(evaluatedAt)
  if (Number.isFinite(commitAt) && Number.isFinite(evaluationTime) && evaluationTime < commitAt) {
    throw new Error(`evaluatedAt ${evaluatedAt} predates commitAt ${metadata.commitAt}`)
  }
  const ageDays = Number.isFinite(commitAt) && Number.isFinite(evaluationTime) ? Math.floor((evaluationTime - commitAt) / 86_400_000) : null
  checks.push(check('engineering.maintenance', 'engineering', 2,
    ageDays === null ? 'UNPROVEN' : ageDays <= 90 ? 'PASS' : ageDays <= 365 ? 'PARTIAL' : 'FAIL', 'E1', ageDays === null ? '未知固定 commit 时间' : `固定 commit 距固定评估时点 ${ageDays} 天`))

  for (const dimension of RUBRIC.dimensions) {
    const implemented = checks.filter(item => item.dimension === dimension.id).reduce((sum, item) => sum + item.points, 0)
    if (implemented !== dimension.points) throw new Error(`rubric drift for ${dimension.id}: configured ${dimension.points}, implemented ${implemented}`)
  }

  if (!realArtifact) {
    return {
      schema: 'dsh-plugin-bench/report-v1',
      target: metadata.target || inspect.root,
      commit: metadata.commit || null,
      commitAt: metadata.commitAt || null,
      evaluatedAt,
      classification: { artifact: metadata.artifact || '.', types: inspect.types, eligible: false, reason: '未发现可由 DSH 加载的 bundle、原生插件包、Skill 或 preset artifact' },
      identity: metadata.identity || 'UNPROVEN',
      quality: null,
      adoption: { scope: 'repository', stars: metadata.stars ?? null, forks: metadata.forks ?? null },
      checks
    }
  }

  let applicable = 0
  let proven = 0
  let earned = 0
  let unproven = 0
  for (const item of checks) {
    if (item.status === 'N/A') continue
    applicable += item.points
    if (item.status === 'UNPROVEN') {
      unproven += item.points
      continue
    }
    proven += item.points
    earned += item.points * VALUE[item.status]
  }
  const normalizedEarned = applicable ? earned * 100 / applicable : 0
  const normalizedUpper = applicable ? (earned + unproven) * 100 / applicable : 0
  const coverage = applicable ? proven * 100 / applicable : 0
  const installFail = runtimeStatus(runtime, 'install.clean-profile')?.status === 'FAIL'
  const functionFail = runtimeStatus(runtime, 'function.core-path')?.status === 'FAIL'
  const unsafe = majorUndisclosed?.status === 'FAIL' || inspect.embeddedSecrets.length > 0
  let lower = normalizedEarned
  let upper = normalizedUpper
  if (installFail) { lower = capScore(lower, 39); upper = capScore(upper, 39) }
  if (functionFail) { lower = capScore(lower, 49); upper = capScore(upper, 49) }
  const formal = coverage >= RUBRIC.minimumCoverageForGrade && !unsafe

  const dimensions = Object.keys(D).map(id => {
    const items = checks.filter(item => item.dimension === id && item.status !== 'N/A')
    const possible = items.reduce((sum, item) => sum + item.points, 0)
    const got = items.reduce((sum, item) => sum + (VALUE[item.status] ?? 0) * item.points, 0)
    const unknown = items.reduce((sum, item) => sum + (item.status === 'UNPROVEN' ? item.points : 0), 0)
    return { id, name: D[id], confirmed: got, possible, unproven: unknown }
  })

  return {
    schema: 'dsh-plugin-bench/report-v1',
    target: metadata.target || inspect.root,
    commit: metadata.commit || null,
    commitAt: metadata.commitAt || null,
    evaluatedAt,
    environment: runtime?.environment || null,
    classification: { artifact: metadata.artifact || '.', types: inspect.types, eligible: true },
    identity: metadata.identity || 'UNPROVEN',
    quality: {
      confirmed: Math.round(lower * 10) / 10,
      upper: Math.round(upper * 10) / 10,
      coverage: Math.round(coverage * 10) / 10,
      formal,
      grade: unsafe ? 'UNSAFE' : formal ? grade(lower) : '暂定/未排名',
      caps: [installFail ? 'install-failure:39' : null, functionFail ? 'core-function-failure:49' : null].filter(Boolean)
    },
    dimensions,
    adoption: { scope: 'repository', stars: metadata.stars ?? null, forks: metadata.forks ?? null },
    checks
  }
}
