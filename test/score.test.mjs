import test, { afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { linkSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { inspectRepository, walk } from '../src/inspect.mjs'
import { scoreInspection } from '../src/score.mjs'
import { formatMarkdown } from '../src/render.mjs'
import { createRuntimeTemplate } from '../src/runtime-template.mjs'
import { requirePinnedSample } from '../src/target.mjs'

const fixtureRoots = []
const TEST_COMMIT = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const TEST_ENVIRONMENT = { dsh: '0.1.0-rc.8', node: '22.22.0', os: 'test-os', profile: 'test-profile', isolatedDshHome: true }
const boundMetadata = (value = {}) => ({ commit: TEST_COMMIT, artifact: '.', ...value })
const boundRuntime = (checks, value = {}) => ({ targetCommit: TEST_COMMIT, targetArtifact: '.', environment: TEST_ENVIRONMENT, checks, ...value })
afterEach(() => {
  for (const root of fixtureRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'dsh-plugin-bench-test-'))
  fixtureRoots.push(root)
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true })
    writeFileSync(join(root, path), content)
  }
  return root
}

test('rejects a topic-only repository instead of inventing a quality score', () => {
  const root = fixture({ 'README.md': '# SEO project\nDeepSeek Harness soon.' })
  const inspection = inspectRepository(root, { topics: ['dsh-plugin'] })
  const report = scoreInspection(inspection, { target: 'fake/topic', topics: ['dsh-plugin'] })
  assert.equal(report.classification.eligible, false)
  assert.equal(report.quality, null)
})

test('recognizes a bundle only when its declared patch exists', () => {
  const pkg = JSON.stringify({
    name: 'demo-bundle',
    license: 'MIT',
    dsh: { bundle: { patch: './cordis.patch.yml' } },
    peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' }
  })
  const root = fixture({
    'package.json': pkg,
    'cordis.patch.yml': '- id: demo\n  name: ./src/index.ts\n',
    'src/index.ts': "export function apply(ctx) { ctx.on('dispose', () => {}) }",
    'README.md': '# Demo\n\n## 功能\n' + '真实插件。'.repeat(100) + '\n## 使用\n`dsh plugin --profile web add demo-bundle`',
    'LICENSE': 'MIT'
  })
  const inspection = inspectRepository(root)
  assert.deepEqual(inspection.types, ['bundle'])
  assert.equal(inspection.bundlePatchResolution[0].exists, true)
  assert.ok(inspection.scoredPaths.includes('src/index.ts'))
  const report = scoreInspection(inspection, { target: 'demo', identity: 'COMMUNITY_DISCOVERABLE' })
  assert.equal(report.classification.eligible, true)
  assert.equal(report.quality.formal, false)
  assert.equal(report.quality.grade, '暂定/未排名')
})

test('resolves local Bundle modules relative to a nested patch without escaping the artifact', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'nested-patch', dsh: { bundle: { patch: './config/cordis.patch.yml' } } }),
    'config/cordis.patch.yml': '- insert:\n    - id: demo\n      name: ../src/plugin.ts\n',
    'src/plugin.ts': 'export const apply = () => true'
  })
  const inspection = inspectRepository(root)
  assert.equal(inspection.bundlePatchResolution[0].exists, true)
  assert.ok(inspection.scoredPaths.includes('src/plugin.ts'))
})

test('runtime evidence raises coverage and preserves stars outside the score', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'skill-pack', license: 'MIT' }),
    'SKILL.md': '---\nname: demo\ndescription: demo\n---\nDo the thing.',
    'README.md': '# Demo skill\n' + 'Usage and configuration. '.repeat(50),
    'LICENSE': 'MIT'
  })
  const inspection = inspectRepository(root)
  const runtime = boundRuntime({
    'function.core-path': { status: 'PASS', level: 'E4', summary: 'passed', evidence: ['trace'] },
    'function.negative-path': { status: 'PASS', level: 'E4', summary: 'passed', evidence: ['trace'] },
    'install.clean-profile': { status: 'PASS', level: 'E3', summary: 'passed', evidence: ['trace'] },
    'install.restart-remove': { status: 'PASS', level: 'E3', summary: 'passed', evidence: ['trace'] },
    'integration.compose-hmr': { status: 'PASS', level: 'E3', summary: 'passed', evidence: ['trace'] },
    'reliability.repeat-run': { status: 'PASS', level: 'E4', summary: 'passed', evidence: ['trace'] },
    'security.permission-scope': { status: 'PASS', level: 'E4', summary: 'passed', evidence: ['trace'] },
    'performance.startup-idle': { status: 'PASS', level: 'E4', summary: 'passed', evidence: ['trace'] },
    'performance.main-path': { status: 'PASS', level: 'E4', summary: 'passed', evidence: ['trace'] },
    'ux.visible-result': { status: 'PASS', level: 'E4', summary: 'passed', evidence: ['trace'] }
  })
  const report = scoreInspection(inspection, boundMetadata({ target: 'demo/skill', stars: 9999 }), runtime)
  assert.equal(report.adoption.stars, 9999)
  assert.ok(report.quality.coverage > 80)
})

test('a confirmed install failure caps both ends of the score at 39', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'broken', license: 'MIT', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'cordis.patch.yml': '[]',
    'README.md': '# Broken\n## 功能\n' + 'feature '.repeat(100) + '\n## 使用\ndsh plugin --profile web add broken',
    'LICENSE': 'MIT'
  })
  const inspection = inspectRepository(root)
  const report = scoreInspection(inspection, boundMetadata(), boundRuntime({ 'install.clean-profile': { status: 'FAIL', level: 'E3', summary: 'failed', evidence: ['trace'] } }))
  assert.ok(report.quality.upper <= 39)
  assert.ok(report.quality.caps.includes('install-failure:39'))
})

test('renders the evidence that triggers the UNSAFE gate', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'unsafe-demo', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'cordis.patch.yml': '[]'
  })
  const report = scoreInspection(inspectRepository(root), boundMetadata(), boundRuntime({
    'security.major-undisclosed': { status: 'FAIL', level: 'E1', summary: 'undisclosed outbound data', evidence: ['trace'] }
  }))
  assert.equal(report.quality.grade, 'UNSAFE')
  assert.deepEqual(report.checks.find(item => item.id === 'security.major-undisclosed'), {
    id: 'security.major-undisclosed', dimension: 'security', dimensionName: '权限、安全与隐私', points: 0,
    status: 'FAIL', level: 'E1', summary: 'undisclosed outbound data', evidence: ['trace']
  })
  const inconclusive = scoreInspection(inspectRepository(root), boundMetadata(), boundRuntime({
    'security.major-undisclosed': { status: 'UNPROVEN', level: 'E3', summary: 'audit ran but could not observe every outbound path', evidence: ['trace#audit'] }
  }))
  assert.notEqual(inconclusive.quality.grade, 'UNSAFE')
  assert.deepEqual(inconclusive.checks.find(item => item.id === 'security.major-undisclosed'), {
    id: 'security.major-undisclosed', dimension: 'security', dimensionName: '权限、安全与隐私', points: 0,
    status: 'UNPROVEN', level: 'E3', summary: 'audit ran but could not observe every outbound path', evidence: ['trace#audit']
  })
})

test('executed E2 evidence overrides an incomplete shallow static scan', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'submodule-plugin', license: 'MIT', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'cordis.patch.yml': '[]',
    'README.md': '# Plugin\n## Features\n' + 'feature '.repeat(100),
    'LICENSE': 'MIT'
  })
  const inspection = inspectRepository(root)
  assert.equal(inspection.hasTests, false)
  const report = scoreInspection(inspection, boundMetadata(), boundRuntime({
    'function.automated-tests': { status: 'PASS', level: 'E2', summary: 'recursive checkout test task passed', evidence: ['trace'] },
    'engineering.verification': { status: 'PASS', level: 'E2', summary: 'build and test passed', evidence: ['trace'] }
  }))
  assert.equal(report.checks.find(item => item.id === 'function.automated-tests').status, 'PASS')
  assert.equal(report.checks.find(item => item.id === 'engineering.verification').status, 'PASS')
})

test('static test files and lifecycle-shaped text cannot claim executed or correlated PASS evidence', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'static-only', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'cordis.patch.yml': '- insert:\n    - id: demo\n      name: ./src/timer.js\n',
    'src/timer.js': 'export const apply = () => { setInterval(() => {}, 1000); AbortSignal.timeout(100) }',
    'src/unrelated.js': 'export const helper = () => { return () => true }',
    'test/plugin.test.js': 'test("placeholder", () => { throw new Error("never executed timeout") })'
  })
  const report = scoreInspection(inspectRepository(root))
  assert.equal(report.checks.find(item => item.id === 'function.automated-tests').status, 'PARTIAL')
  assert.equal(report.checks.find(item => item.id === 'function.automated-tests').level, 'E1')
  assert.equal(report.checks.find(item => item.id === 'integration.lifecycle').status, 'PARTIAL')
  assert.equal(report.checks.find(item => item.id === 'reliability.error-tests').status, 'PARTIAL')
  assert.equal(report.checks.find(item => item.id === 'reliability.timeout-cancel').status, 'PARTIAL')
})

test('scans Bundle runtime configuration for embedded credentials', () => {
  const syntheticCredential = 'sk-' + 'a'.repeat(24)
  const root = fixture({
    'package.json': JSON.stringify({ name: 'config-secret', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'cordis.patch.yml': `- insert:\n    - id: demo\n      name: ./src/plugin.js\n      config:\n        apiKey: ${syntheticCredential}\n`,
    'src/plugin.js': 'export const apply = () => true'
  })
  const inspection = inspectRepository(root)
  assert.deepEqual(inspection.embeddedSecrets, ['cordis.patch.yml'])
  assert.equal(scoreInspection(inspection).checks.find(item => item.id === 'security.embedded-secret').status, 'FAIL')
})

test('does not exclude runtime source merely because its filename contains test', () => {
  const syntheticCredential = 'sk-' + 'b'.repeat(24)
  const root = fixture({
    'package.json': JSON.stringify({ name: 'hit-test-runtime', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'cordis.patch.yml': '- insert:\n    - id: demo\n      name: ./src/hit-test.ts\n',
    'src/hit-test.ts': `export const key = ${JSON.stringify(syntheticCredential)}`
  })
  const inspection = inspectRepository(root)
  assert.deepEqual(inspection.testPaths, [])
  assert.deepEqual(inspection.embeddedSecrets, ['src/hit-test.ts'])
})

test('reads mts and cts runtime sources for security evidence', () => {
  for (const extension of ['mts', 'cts']) {
    const syntheticCredential = 'sk-' + extension.repeat(10)
    const root = fixture({
      'package.json': JSON.stringify({ name: `secret-${extension}`, dsh: { bundle: { patch: './cordis.patch.yml' } } }),
      'cordis.patch.yml': `- insert:\n    - id: demo\n      name: ./src/index.${extension}\n`,
      [`src/index.${extension}`]: `export const key = ${JSON.stringify(syntheticCredential)}`
    })
    assert.deepEqual(inspectRepository(root).embeddedSecrets, [`src/index.${extension}`])
  }
})

test('uses one stable engineering.verification id for static and runtime evidence', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'stable-check-id', dsh: { bundle: { patch: './cordis.patch.yml' } }, scripts: { test: 'node --test' } }),
    'cordis.patch.yml': '[]',
    'test/demo.test.js': 'test("demo", () => {})'
  })
  const inspection = inspectRepository(root)
  const staticReport = scoreInspection(inspection)
  assert.ok(staticReport.checks.some(item => item.id === 'engineering.verification'))
  assert.equal(staticReport.checks.some(item => item.id === 'engineering.automation'), false)
  const runtimeReport = scoreInspection(inspection, boundMetadata(), boundRuntime({
    'engineering.verification': { status: 'PASS', level: 'E2', summary: 'checks ran', evidence: ['trace'] }
  }))
  assert.equal(runtimeReport.checks.find(item => item.id === 'engineering.verification').status, 'PASS')
})

test('runtime UNPROVEN preserves static findings while retaining scoped attempts that remain unproven', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'template-round-trip', dsh: { bundle: { patch: './cordis.patch.yml' } }, scripts: { test: 'node --test', check: 'node --check src/index.js' } }),
    'cordis.patch.yml': '[]',
    'src/index.js': 'export const apply = () => true',
    'test/demo.test.js': 'test("rejects invalid input", () => {})',
    '.github/workflows/ci.yml': 'name: CI',
    'README.md': '# Template round trip\n\n## Features and usage\n' + 'documented behavior '.repeat(40)
  })
  const inspection = inspectRepository(root)
  const metadata = boundMetadata({ target: 'fixture/template', evaluatedAt: '2026-08-22T00:00:00Z' })
  const baseline = scoreInspection(inspection, metadata)
  const template = createRuntimeTemplate(baseline)
  const untouched = scoreInspection(inspection, metadata, template)
  assert.deepEqual(untouched.quality, baseline.quality)
  assert.deepEqual(untouched.checks, baseline.checks)

  const filled = structuredClone(template)
  filled.environment = TEST_ENVIRONMENT
  filled.checks['function.core-path'] = { status: 'PASS', level: 'E4', summary: 'main path passed', evidence: ['trace'] }
  const rescored = scoreInspection(inspection, metadata, filled)
  const changedIds = rescored.checks
    .filter((item, index) => JSON.stringify(item) !== JSON.stringify(baseline.checks[index]))
    .map(item => item.id)
  assert.deepEqual(changedIds, ['function.core-path'])

  const observed = structuredClone(template)
  observed.environment = TEST_ENVIRONMENT
  observed.checks['reliability.repeat-run'] = {
    status: 'UNPROVEN', level: 'E4', summary: 'two different paths ran, so repeatability remains unknown', evidence: ['trace#attempt']
  }
  observed.checks['function.automated-tests'] = {
    status: 'UNPROVEN', level: 'E2', summary: 'test command could not finish', evidence: ['trace#tests']
  }
  const observedReport = scoreInspection(inspection, metadata, observed)
  assert.deepEqual(observedReport.quality, baseline.quality)
  assert.deepEqual(observedReport.checks.find(item => item.id === 'reliability.repeat-run'), {
    id: 'reliability.repeat-run', dimension: 'reliability', dimensionName: '可靠性与状态完整性', points: 3,
    status: 'UNPROVEN', level: 'E4', summary: 'two different paths ran, so repeatability remains unknown', evidence: ['trace#attempt']
  })
  assert.deepEqual(
    observedReport.checks.find(item => item.id === 'function.automated-tests'),
    baseline.checks.find(item => item.id === 'function.automated-tests')
  )
})

test('Markdown scorecards expose every PASS, N/A, and gap check', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'complete-ledger', license: 'MIT', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'cordis.patch.yml': '[]',
    'README.md': '# Complete ledger\n\n## Features and usage\n' + 'documented behavior '.repeat(40),
    'LICENSE': 'MIT'
  })
  const report = scoreInspection(inspectRepository(root), { target: 'fixture/ledger', evaluatedAt: '2026-08-22T00:00:00Z' })
  const markdown = formatMarkdown(report)
  assert.match(markdown, /## Complete evidence ledger/)
  assert.ok(report.checks.some(item => item.status === 'PASS'))
  assert.ok(report.checks.some(item => item.status === 'N\/A'))
  for (const item of report.checks) assert.ok(markdown.includes('`' + item.id + '`'), item.id)

  const observed = scoreInspection(inspectRepository(root), boundMetadata({ target: 'fixture/ledger' }), boundRuntime({
    'function.core-path': { status: 'PASS', level: 'E4', summary: 'main path passed', evidence: ['evidence/raw/trace.md#core'] }
  }))
  assert.match(formatMarkdown(observed), /Evidence: evidence\/raw\/trace\.md#core/)
  assert.match(formatMarkdown(observed, { evidenceHrefPrefix: '' }), /\[evidence\/raw\/trace\.md#core\]\(evidence\/raw\/trace\.md#core\)/)
  assert.match(formatMarkdown(observed, { evidenceHrefPrefix: '../' }), /\]\(\.\.\/evidence\/raw\/trace\.md#core\)/)
})

test('rejects stale or malformed runtime evidence', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'demo', license: 'MIT' }),
    'SKILL.md': '---\nname: demo\ndescription: demo\n---\nDemo',
    'LICENSE': 'MIT'
  })
  const inspection = inspectRepository(root)
  assert.throws(
    () => scoreInspection(inspection, boundMetadata(), { targetCommit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', targetArtifact: '.', checks: {} }),
    /does not match/
  )
  assert.throws(
    () => scoreInspection(inspection, boundMetadata(), boundRuntime({ 'function.core-path': { status: 'MAYBE', level: 'E4' } })),
    /invalid runtime status/
  )
  assert.throws(
    () => scoreInspection(inspection, boundMetadata(), boundRuntime({
      'function.typo': { status: 'PASS', level: 'E4', summary: 'x', evidence: ['x'] }
    })),
    /unknown runtime check id/
  )
})

test('identity labels cannot change quality checks or score', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'identity-neutral', license: 'MIT', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'cordis.patch.yml': '[]',
    'README.md': '# Identity neutral\n' + 'features and usage '.repeat(80),
    'LICENSE': 'MIT'
  })
  const inspection = inspectRepository(root)
  const official = scoreInspection(inspection, { identity: 'OFFICIAL_BUILT_IN', evaluatedAt: '2026-08-20T00:00:00Z' })
  const community = scoreInspection(inspection, { identity: 'COMMUNITY_DISCOVERABLE', evaluatedAt: '2026-08-20T00:00:00Z' })
  assert.deepEqual(official.quality, community.quality)
  assert.deepEqual(official.checks, community.checks)
  assert.throws(() => scoreInspection(inspection, { identity: 'OFFICIAL_TRUST_ME' }), /invalid identity label/)
  assert.throws(() => scoreInspection(inspection, { evaluatedAt: 'whenever' }), /invalid evaluatedAt/)
  assert.throws(() => scoreInspection(inspection, { commitAt: '2026-08-20T00:00:00Z', evaluatedAt: '1970-01-01T00:00:00Z' }), /predates commitAt/)
})

test('rejects low-level PASS, runtime N/A, and missing full commit binding', () => {
  const root = fixture({ 'SKILL.md': '---\nname: demo\ndescription: demo\n---\nDemo' })
  const inspection = inspectRepository(root)
  assert.throws(() => scoreInspection(inspection, boundMetadata(), boundRuntime({
    'function.core-path': { status: 'PASS', level: 'E0', summary: 'claimed', evidence: ['README'] }
  })), /requires E4/)
  assert.throws(() => scoreInspection(inspection, boundMetadata(), boundRuntime({
    'function.core-path': { status: 'N\/A', level: 'E4', summary: 'omit', evidence: ['claim'] }
  })), /invalid runtime status/)
  assert.throws(() => scoreInspection(inspection, boundMetadata(), { targetArtifact: '.', checks: {} }), /full 40-character targetCommit/)
  assert.throws(() => scoreInspection(inspection, boundMetadata(), { targetCommit: TEST_COMMIT, targetArtifact: 'packages/other', checks: {} }), /does not match inspected artifact/)
  assert.throws(() => scoreInspection(inspection, {}, boundRuntime({})), /inspected full 40-character git commit/)
  assert.throws(() => scoreInspection(inspection, boundMetadata(), boundRuntime({
    'function.automated-tests': { status: 'PASS', level: 'E2', summary: 'passed', evidence: [''] }
  })), /non-empty string evidence/)
  assert.throws(() => scoreInspection(inspection, boundMetadata(), boundRuntime({
    'install.clean-profile': { status: 'PASS', level: 'E3', summary: 'passed', evidence: ['trace'] }
  }, { environment: null })), /requires non-empty environment/)
  assert.throws(() => scoreInspection(inspection, boundMetadata(), boundRuntime({
    'install.clean-profile': { status: 'PASS', level: 'E3', summary: 'passed', evidence: ['trace'] }
  }, { environment: { dsh: '', node: ' ', os: '', isolatedDshHome: false } })), /isolatedDshHome=true/)
  assert.throws(() => scoreInspection(inspection, boundMetadata(), boundRuntime({
    'install.clean-profile': { status: 'PASS', level: 'E3', summary: 'passed', evidence: ['trace'] }
  }, { environment: { dsh: '0.1.0', node: '22.0.0', os: 'test-os', profile: '', isolatedDshHome: true } })), /environment\.dsh\/node\/os\/profile/)
  assert.throws(() => scoreInspection(inspection, boundMetadata(), boundRuntime({
    'reliability.repeat-run': { status: 'UNPROVEN', level: 'E4', summary: 'attempted', evidence: [''] }
  })), /observed UNPROVEN requires/)
  assert.throws(() => scoreInspection(inspection, boundMetadata(), boundRuntime({
    'reliability.repeat-run': { status: 'UNPROVEN', level: 'E4', summary: 'attempted but inconclusive', evidence: ['trace'] }
  }, { environment: null })), /requires non-empty environment/)
})

test('does not classify DSH SDK consumers, invariant subpaths, or nested skills as plugin artifacts', () => {
  const root = fixture({
    'package.json': JSON.stringify({
      name: '@deepseek-ai/dsh-sdk-client',
      main: 'lib/index.js',
      exports: { '.': './lib/index.js', './invariant': './lib/invariant.js' },
      peerDependencies: { '@deepseek-ai/cordis': '^4.0.0', '@deepseek-ai/dsh-session': '^0.1.0' },
      devDependencies: { '@deepseek-ai/dsh-tools': '^0.1.0' }
    }),
    'src/index.js': 'export { Client } from "./client.js"',
    'src/invariant.js': 'export const apply = (ctx) => ctx.on("event", () => {})',
    'docs/demo/SKILL.md': '---\nname: nested\n---\nNot discoverable'
  })
  const inspection = inspectRepository(root, { topics: ['dsh-plugin'] })
  assert.equal(inspection.types.includes('native-plugin'), false)
  assert.equal(inspection.types.includes('skill'), false)
  assert.equal(scoreInspection(inspection).quality, null)

  const subpathOnly = fixture({
    'package.json': JSON.stringify({
      name: 'subpath-only-library',
      exports: { './helper': './src/helper.js' },
      keywords: ['dsh-plugin'],
      peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' }
    }),
    'src/index.js': 'export const apply = (ctx) => ctx.on("event", () => {})',
    'src/helper.js': 'export const helper = true'
  })
  assert.equal(inspectRepository(subpathOnly).types.includes('native-plugin'), false)

  const ordinaryRootEntry = fixture({
    'package.json': JSON.stringify({
      name: 'ordinary-root-library',
      main: './src/library.js',
      keywords: ['dsh-plugin'],
      peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' }
    }),
    'src/library.js': 'export const library = true',
    'src/index.js': 'export const apply = (ctx) => ctx.on("event", () => {})'
  })
  assert.equal(inspectRepository(ordinaryRootEntry).types.includes('native-plugin'), false)
})

test('scores a monorepo plugin only from its selected artifact root', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'large-app', scripts: { test: 'all-the-tests' } }),
    'packages/plugin/package.json': JSON.stringify({ name: 'actual-plugin', license: 'MIT', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'packages/plugin/cordis.patch.yml': '[]',
    'packages/plugin/README.md': '# Actual plugin\nUsage: dsh plugin --profile web add actual-plugin',
    'unrelated/tests/app.test.js': 'throw new Error("mother repo tests must not count")'
  })
  assert.equal(scoreInspection(inspectRepository(root)).quality, null)
  const artifact = join(root, 'packages/plugin')
  const inspection = inspectRepository(artifact)
  assert.deepEqual(inspection.types, ['bundle'])
  assert.equal(inspection.hasTests, false)
})

test('fails closed when an artifact exceeds the scan bound', () => {
  const root = fixture({ 'a.txt': 'a', 'b.txt': 'b' })
  assert.throws(() => walk(root, 5, 1), /select a narrower --artifact path/)
})

test('accepts official flat Skill YAML semantics and export const apply plugins', () => {
  const skillRoot = fixture({
    'demo.md': '---\ndescription: >-\n  A valid multiline description\nname: "demo-skill"\n---\nUse this skill.'
  })
  const skill = inspectRepository(join(skillRoot, 'demo.md'))
  assert.deepEqual(skill.types, ['skill'])

  const pluginRoot = fixture({
    'package.json': JSON.stringify({
      name: 'const-apply-plugin',
      keywords: ['dsh-plugin'],
      exports: './src/index.js',
      peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' }
    }),
    'src/index.js': 'export const apply = (ctx) => ctx.on("ready", () => {})'
  })
  assert.deepEqual(inspectRepository(pluginRoot).types, ['native-plugin'])

  const declaredEntryRoot = fixture({
    'package.json': JSON.stringify({
      name: 'declared-entry-plugin',
      keywords: ['deepseek-harness'],
      exports: './src/plugin.js',
      peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' }
    }),
    'src/plugin.js': 'export const apply = (ctx) => ctx.on("ready", () => {})',
    'src/invariant.js': 'export default { notAPlugin: true }'
  })
  assert.deepEqual(inspectRepository(declaredEntryRoot).types, ['native-plugin'])

  const moduleEntryRoot = fixture({
    'package.json': JSON.stringify({
      name: 'module-entry-plugin',
      keywords: ['dsh-plugin'],
      module: './src/plugin.js',
      peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' }
    }),
    'src/plugin.js': 'export const apply = (ctx) => ctx.on("ready", () => {})'
  })
  assert.deepEqual(inspectRepository(moduleEntryRoot).types, ['native-plugin'])

  for (const field of ['main', 'module', 'exports']) {
    const manifest = {
      name: `build-entry-${field}`,
      keywords: ['dsh-plugin'],
      peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' }
    }
    manifest[field] = './build/cordis.js'
    const buildEntryRoot = fixture({
      'package.json': JSON.stringify(manifest),
      'build/cordis.js': 'export const apply = (ctx) => ctx.on("ready", () => {})'
    })
    assert.deepEqual(inspectRepository(buildEntryRoot).types, ['native-plugin'], field)
  }

  const commentOnlyRoot = fixture({
    'package.json': JSON.stringify({ name: 'comment-only', exports: './src/index.js', keywords: ['dsh-plugin'], peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
    'src/index.js': '// export function apply(ctx) { ctx.on("ready", () => {}) }\nexport const value = 1'
  })
  assert.equal(inspectRepository(commentOnlyRoot).types.includes('native-plugin'), false)

  const reexportRoot = fixture({
    'package.json': JSON.stringify({ name: 'barrel-plugin', exports: './src/index.js', keywords: ['dsh-plugin'], peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
    'src/index.js': 'export { apply } from "./plugin.js"',
    'src/plugin.js': 'export const apply = (ctx) => ctx.on("ready", () => {})'
  })
  assert.deepEqual(inspectRepository(reexportRoot).types, ['native-plugin'])

  for (const expression of ['1', '"not callable"', '{}']) {
    const nonCallableRoot = fixture({
      'package.json': JSON.stringify({ name: 'non-callable-apply', exports: './src/index.js', keywords: ['dsh-plugin'], peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
      'src/index.js': `export const apply = ${expression}`
    })
    assert.equal(inspectRepository(nonCallableRoot).types.includes('native-plugin'), false, expression)
  }

  const aliasRoot = fixture({
    'package.json': JSON.stringify({ name: 'alias-barrel-plugin', exports: './src/index.js', keywords: ['dsh-plugin'], peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
    'src/index.js': 'export { plugin as apply } from "./plugin.js"',
    'src/plugin.js': 'export const plugin = (ctx) => ctx.on("ready", () => {})'
  })
  assert.deepEqual(inspectRepository(aliasRoot).types, ['native-plugin'])

  const importExportRoot = fixture({
    'package.json': JSON.stringify({ name: 'import-export-plugin', exports: './src/index.js', keywords: ['dsh-plugin'], peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
    'src/index.js': 'import { apply } from "./plugin.js"; export { apply }',
    'src/plugin.js': 'export const apply = (ctx) => ctx.on("ready", () => {})'
  })
  assert.deepEqual(inspectRepository(importExportRoot).types, ['native-plugin'])

  const fakeServiceRoot = fixture({
    'package.json': JSON.stringify({ name: 'ordinary-service-library', exports: './src/index.js', peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
    'src/index.js': 'class Service {}\nexport default class LocalWorker extends Service {}'
  })
  assert.equal(inspectRepository(fakeServiceRoot).types.includes('native-plugin'), false)

  const cordisServiceRoot = fixture({
    'package.json': JSON.stringify({ name: 'cordis-service', exports: './src/index.ts', keywords: ['dsh-plugin'], peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
    'src/index.ts': 'import { Service as CordisService } from "@deepseek-ai/cordis"\nexport default class Plugin extends CordisService {}'
  })
  assert.deepEqual(inspectRepository(cordisServiceRoot).types, ['native-plugin'])

  const indirectCordisServiceRoot = fixture({
    'package.json': JSON.stringify({ name: 'indirect-cordis-service', exports: './src/index.ts', keywords: ['dsh-plugin'], peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
    'src/index.ts': 'import { Service as CordisService } from "@deepseek-ai/cordis"\nclass BasePicker extends CordisService {}\nexport default class BrowsePicker extends BasePicker {}'
  })
  assert.deepEqual(inspectRepository(indirectCordisServiceRoot).types, ['native-plugin'])

  const objectPluginRoot = fixture({
    'package.json': JSON.stringify({ name: 'object-plugin', exports: './src/index.ts', keywords: ['dsh-plugin'], peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
    'src/index.ts': 'export default { name: "object-plugin", apply(ctx) { ctx.on("ready", () => {}) } }'
  })
  assert.deepEqual(inspectRepository(objectPluginRoot).types, ['native-plugin'])

  const constructorPluginRoot = fixture({
    'package.json': JSON.stringify({ name: 'constructor-plugin', exports: './src/index.ts', keywords: ['dsh-plugin'], peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
    'src/index.ts': 'export default class Plugin { constructor(ctx) { ctx.on("ready", () => {}) } }'
  })
  assert.deepEqual(inspectRepository(constructorPluginRoot).types, ['native-plugin'])

  for (const [form, source] of [
    ['function', 'module.exports = function apply(ctx) { ctx.on("ready", () => {}) }'],
    ['object', 'module.exports = { apply(ctx) { ctx.on("ready", () => {}) } }'],
    ['constructor', 'module.exports = class Plugin { constructor(ctx) { ctx.on("ready", () => {}) } }']
  ]) {
    const commonJsRoot = fixture({
      'package.json': JSON.stringify({ name: `commonjs-${form}`, exports: './src/index.cjs', keywords: ['dsh-plugin'], peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
      'src/index.cjs': source
    })
    assert.deepEqual(inspectRepository(commonJsRoot).types, ['native-plugin'], form)
  }

  const topicIntentRoot = fixture({
    'package.json': JSON.stringify({ name: 'topic-discovered-plugin', exports: './src/index.js', peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' } }),
    'src/index.js': 'export function apply(ctx) { ctx.on("ready", () => {}) }'
  })
  assert.deepEqual(inspectRepository(topicIntentRoot, { topics: ['dsh-plugin'] }).types, ['native-plugin'])
})

test('accepts only official plugin-row Preset shapes', () => {
  const valid = fixture({
    'agent.cordis.yml': '- name: ./plugin.js\n- name: nested\n  group: true\n  config:\n    - name: ./nested.js\n'
  })
  assert.deepEqual(inspectRepository(valid).types, ['preset'])

  for (const content of ['notRows: true\n', '- id: missing-name\n', '- name: group\n  group: true\n  config: nope\n']) {
    const invalid = fixture({ 'agent.cordis.yml': content })
    assert.equal(inspectRepository(invalid).types.includes('preset'), false)
  }
})

test('batch samples require a full commit pin', () => {
  assert.equal(requirePinnedSample({ commit: TEST_COMMIT }), TEST_COMMIT)
  assert.throws(() => requirePinnedSample({}), /full 40-character git commit/)
  assert.throws(() => requirePinnedSample({ commit: 'abc123' }), /full 40-character git commit/)
})

test('published batch samples use portable GitHub targets', () => {
  const suite = JSON.parse(readFileSync(new URL('../samples/targets.json', import.meta.url), 'utf8'))
  for (const sample of suite.targets) {
    assert.match(sample.target, /^[^/\s]+\/[^/\s]+$/, sample.label)
  }
})

test('CLI rejects missing option values', () => {
  const root = fixture({ 'README.md': '# demo' })
  for (const option of ['--ref', '--artifact', '--evaluated-at', '--runtime', '--runtime-template', '--identity', '--format', '--output']) {
    const result = spawnSync(process.execPath, ['src/cli.mjs', root, option], { cwd: join(import.meta.dirname, '..'), encoding: 'utf8' })
    assert.equal(result.status, 2, option)
    assert.match(result.stderr, /requires a value/)
  }
  const unknown = spawnSync(process.execPath, ['src/cli.mjs', root, '--surprise'], { cwd: join(import.meta.dirname, '..'), encoding: 'utf8' })
  assert.equal(unknown.status, 2)
  assert.match(unknown.stderr, /unknown option/)
})

test('CLI provides help, version, shareable outputs, and a bound runtime template', () => {
  const projectRoot = join(import.meta.dirname, '..')
  const help = spawnSync(process.execPath, ['src/cli.mjs', '--help'], { cwd: projectRoot, encoding: 'utf8' })
  assert.equal(help.status, 0)
  assert.match(help.stdout, /Evidence-backed quality scorecards/)
  assert.match(help.stdout, /--runtime-template/)
  const version = spawnSync(process.execPath, ['src/cli.mjs', '--version'], { cwd: projectRoot, encoding: 'utf8' })
  assert.equal(version.status, 0)
  assert.equal(version.stdout.trim(), '0.2.0')

  const root = fixture({
    'package.json': JSON.stringify({ name: 'shareable-plugin', license: 'MIT', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'cordis.patch.yml': '- insert:\n    - id: demo\n      name: ./src/plugin.js\n',
    'src/plugin.js': 'export const apply = () => true',
    'README.md': '# Shareable plugin\n\n## Features\n' + 'quality evidence '.repeat(40),
    'evidence/run.md': '# Core path trace'
  })
  execFileSync('git', ['init', '-b', 'main'], { cwd: root })
  execFileSync('git', ['config', 'user.email', 'bench@example.invalid'], { cwd: root })
  execFileSync('git', ['config', 'user.name', 'Bench Test'], { cwd: root })
  execFileSync('git', ['add', '.'], { cwd: root })
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: root, stdio: 'ignore' })
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  const outputRoot = fixture({})
  const markdownPath = join(outputRoot, 'scorecard.md')
  const badgePath = join(outputRoot, 'dsh-quality.svg')
  const templatePath = join(outputRoot, 'runtime-evidence.json')

  const markdown = spawnSync(process.execPath, ['src/cli.mjs', root, '--ref', commit, '--output', markdownPath], { cwd: projectRoot, encoding: 'utf8' })
  assert.equal(markdown.status, 0, markdown.stderr)
  assert.match(readFileSync(markdownPath, 'utf8'), /# DSH Plugin Quality Scorecard/)
  assert.match(readFileSync(markdownPath, 'utf8'), new RegExp(commit))

  const badge = spawnSync(process.execPath, ['src/cli.mjs', root, '--ref', commit, '--output', badgePath], { cwd: projectRoot, encoding: 'utf8' })
  assert.equal(badge.status, 0, badge.stderr)
  assert.match(readFileSync(badgePath, 'utf8'), /<svg/)
  assert.match(readFileSync(badgePath, 'utf8'), /DSH quality/)

  const template = spawnSync(process.execPath, ['src/cli.mjs', root, '--ref', commit, '--runtime-template', templatePath, '--format', 'json'], { cwd: projectRoot, encoding: 'utf8' })
  assert.equal(template.status, 0, template.stderr)
  const parsed = JSON.parse(readFileSync(templatePath, 'utf8'))
  assert.equal(parsed.targetCommit, commit)
  assert.equal(parsed.targetArtifact, '.')
  assert.equal(parsed.environment.isolatedDshHome, false)
  assert.equal(parsed.checks['function.core-path'].status, 'UNPROVEN')

  const refusesOverwrite = spawnSync(process.execPath, ['src/cli.mjs', root, '--ref', commit, '--output', markdownPath], { cwd: projectRoot, encoding: 'utf8' })
  assert.equal(refusesOverwrite.status, 1)
  assert.match(refusesOverwrite.stderr, /already exists; use --force to overwrite/)
  assert.doesNotMatch(refusesOverwrite.stderr, /\n\s+at /)
  const forced = spawnSync(process.execPath, ['src/cli.mjs', root, '--ref', commit, '--output', markdownPath, '--force'], { cwd: projectRoot, encoding: 'utf8' })
  assert.equal(forced.status, 0, forced.stderr)

  const runtimeBefore = readFileSync(templatePath, 'utf8')
  for (const collision of [
    ['--runtime', templatePath, '--output', templatePath, '--force'],
    ['--runtime', templatePath, '--runtime-template', templatePath, '--force']
  ]) {
    const result = spawnSync(process.execPath, ['src/cli.mjs', root, '--ref', commit, ...collision], { cwd: projectRoot, encoding: 'utf8' })
    assert.equal(result.status, 2)
    assert.match(result.stderr, /--runtime and --(?:output|runtime-template) must use different files/)
    assert.equal(readFileSync(templatePath, 'utf8'), runtimeBefore)
  }
  const runtimeAlias = join(outputRoot, 'runtime-alias.json')
  linkSync(templatePath, runtimeAlias)
  for (const collision of [
    ['--runtime', templatePath, '--output', runtimeAlias, '--force'],
    ['--runtime', templatePath, '--runtime-template', runtimeAlias, '--force']
  ]) {
    const result = spawnSync(process.execPath, ['src/cli.mjs', root, '--ref', commit, ...collision], { cwd: projectRoot, encoding: 'utf8' })
    assert.equal(result.status, 2)
    assert.match(result.stderr, /must use different files/)
    assert.equal(readFileSync(templatePath, 'utf8'), runtimeBefore)
  }

  const observedRuntimePath = join(outputRoot, 'observed-runtime.json')
  writeFileSync(observedRuntimePath, JSON.stringify({
    targetCommit: commit,
    targetArtifact: '.',
    environment: TEST_ENVIRONMENT,
    checks: { 'function.core-path': { status: 'PASS', level: 'E4', summary: 'main path passed', evidence: ['evidence/run.md#core'] } }
  }))
  const nestedScorecard = spawnSync(process.execPath, [join(projectRoot, 'src/cli.mjs'), '.', '--ref', commit, '--runtime', observedRuntimePath, '--output', 'reports/scorecard.md'], { cwd: root, encoding: 'utf8' })
  assert.equal(nestedScorecard.status, 0, nestedScorecard.stderr)
  assert.match(readFileSync(join(root, 'reports/scorecard.md'), 'utf8'), /\[evidence\/run\.md#core\]\(\.\.\/evidence\/run\.md#core\)/)
})

test('local CLI infers repo-relative artifact and refuses dirty commit-bound scoring', () => {
  const root = fixture({
    'packages/plugin/package.json': JSON.stringify({ name: 'local-plugin', license: 'MIT', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'packages/plugin/cordis.patch.yml': '[]',
    'packages/plugin/README.md': '# Local plugin\nUsage: dsh plugin --profile web add local-plugin'
  })
  execFileSync('git', ['init', '-b', 'main'], { cwd: root })
  execFileSync('git', ['config', 'user.email', 'bench@example.invalid'], { cwd: root })
  execFileSync('git', ['config', 'user.name', 'Bench Test'], { cwd: root })
  execFileSync('git', ['add', '.'], { cwd: root })
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: root, stdio: 'ignore' })
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  const artifact = join(root, 'packages/plugin')
  const clean = spawnSync(process.execPath, ['src/cli.mjs', artifact, '--ref', commit, '--json'], { cwd: join(import.meta.dirname, '..'), encoding: 'utf8' })
  assert.equal(clean.status, 0, clean.stderr)
  assert.equal(JSON.parse(clean.stdout).classification.artifact, 'packages/plugin')
  const textReport = spawnSync(process.execPath, ['src/cli.mjs', artifact, '--ref', commit, '--evaluated-at', '2099-01-01T00:00:00Z'], { cwd: join(import.meta.dirname, '..'), encoding: 'utf8' })
  assert.equal(textReport.status, 0, textReport.stderr)
  assert.match(textReport.stdout, new RegExp(`commit: ${commit}`))
  assert.match(textReport.stdout, /artifact: packages\/plugin/)
  assert.match(textReport.stdout, /evaluated-at: 2099-01-01T00:00:00Z/)
  assert.match(textReport.stdout, /^commit-at: /m)
  assert.doesNotMatch(textReport.stdout, /^artifact-commit-at: /m)

  writeFileSync(join(artifact, 'README.md'), '# dirty')
  const dirty = spawnSync(process.execPath, ['src/cli.mjs', artifact, '--ref', commit, '--json'], { cwd: join(import.meta.dirname, '..'), encoding: 'utf8' })
  assert.equal(dirty.status, 1)
  assert.match(dirty.stderr, /refuses dirty or untracked artifact/)
})

test('local CLI refuses an ignored manifest entry that is absent from the pinned commit', () => {
  const root = fixture({
    '.gitignore': 'build/\n',
    'package.json': JSON.stringify({
      name: 'ignored-build-plugin',
      main: './build/plugin.js',
      keywords: ['dsh-plugin'],
      peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' }
    }),
    'build/plugin.js': 'export const apply = (ctx) => ctx.on("ready", () => {})'
  })
  execFileSync('git', ['init', '-b', 'main'], { cwd: root })
  execFileSync('git', ['config', 'user.email', 'bench@example.invalid'], { cwd: root })
  execFileSync('git', ['config', 'user.name', 'Bench Test'], { cwd: root })
  execFileSync('git', ['add', '.'], { cwd: root })
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: root, stdio: 'ignore' })
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  const result = spawnSync(process.execPath, ['src/cli.mjs', root, '--ref', commit, '--json'], { cwd: join(import.meta.dirname, '..'), encoding: 'utf8' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /entries absent from commit/)
})

test('commit-bound CLI refuses ignored Bundle, Skill, and Preset identity files', () => {
  const cases = [
    ['bundle', {
      '.gitignore': 'cordis.patch.yml\n',
      'package.json': JSON.stringify({ name: 'ignored-bundle', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
      'cordis.patch.yml': '[]'
    }],
    ['skill', { '.gitignore': 'SKILL.md\n', 'SKILL.md': '---\nname: ignored-skill\ndescription: ignored\n---\nIgnored' }],
    ['preset', { '.gitignore': 'agent.cordis.yml\n', 'agent.cordis.yml': '[]' }]
  ]
  for (const [label, files] of cases) {
    const root = fixture(files)
    execFileSync('git', ['init', '-b', 'main'], { cwd: root })
    execFileSync('git', ['config', 'user.email', 'bench@example.invalid'], { cwd: root })
    execFileSync('git', ['config', 'user.name', 'Bench Test'], { cwd: root })
    execFileSync('git', ['add', '.'], { cwd: root })
    execFileSync('git', ['commit', '-m', 'fixture'], { cwd: root, stdio: 'ignore' })
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
    const result = spawnSync(process.execPath, ['src/cli.mjs', root, '--ref', commit, '--json'], { cwd: join(import.meta.dirname, '..'), encoding: 'utf8' })
    assert.equal(result.status, 1, label)
    assert.match(result.stderr, /entries absent from commit/, label)
  }
})

test('commit-bound CLI refuses an ignored local module referenced by a Bundle patch', () => {
  const root = fixture({
    '.gitignore': 'build/\n',
    'package.json': JSON.stringify({ name: 'ignored-bundle-module', dsh: { bundle: { patch: './cordis.patch.yml' } } }),
    'cordis.patch.yml': '- insert:\n    - id: demo\n      name: ./build/plugin.js\n',
    'build/plugin.js': 'export const apply = () => true'
  })
  execFileSync('git', ['init', '-b', 'main'], { cwd: root })
  execFileSync('git', ['config', 'user.email', 'bench@example.invalid'], { cwd: root })
  execFileSync('git', ['config', 'user.name', 'Bench Test'], { cwd: root })
  execFileSync('git', ['add', '.'], { cwd: root })
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: root, stdio: 'ignore' })
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  const result = spawnSync(process.execPath, ['src/cli.mjs', root, '--ref', commit, '--json'], { cwd: join(import.meta.dirname, '..'), encoding: 'utf8' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /entries absent from commit/)
})
