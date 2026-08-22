import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'
import ts from 'typescript'
import { parse as parseYaml } from 'yaml'

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'lib', 'build', 'coverage', '.next', '.cache', 'vendor'])
const TEXT_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.tsx', '.jsx', '.vue', '.svelte', '.json', '.yml', '.yaml', '.md', '.css', '.scss', '.sh', '.py'])

function extension(path) {
  const index = path.lastIndexOf('.')
  return index < 0 ? '' : path.slice(index)
}

export function walk(root, maxDepth = 5, maxFiles = 6000) {
  const files = []
  const queue = [{ dir: root, depth: 0 }]
  while (queue.length) {
    const { dir, depth } = queue.shift()
    if (depth > maxDepth) throw new Error(`artifact scan exceeds depth ${maxDepth}; select a narrower --artifact path`)
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) queue.push({ dir: path, depth: depth + 1 })
      } else if (entry.isFile()) {
        if (files.length >= maxFiles) throw new Error(`artifact scan exceeds ${maxFiles} files; select a narrower --artifact path`)
        files.push(path)
      }
    }
  }
  return files
}

function readText(path) {
  try {
    if (statSync(path).size > 2_000_000 || !TEXT_EXTENSIONS.has(extension(path))) return ''
    return readFileSync(path, 'utf8')
  } catch {
    return ''
  }
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function readCombined(paths, label, maxBytes = 50_000_000) {
  let bytes = 0
  const chunks = []
  for (const path of paths) {
    const value = readText(path)
    bytes += Buffer.byteLength(value)
    if (bytes > maxBytes) throw new Error(`${label} content exceeds ${maxBytes} bytes; select a narrower --artifact path`)
    chunks.push(value)
  }
  return chunks.join('\n')
}

function parseSkill(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) return null
  try {
    const value = parseYaml(match[1])
    if (!value || typeof value !== 'object') return null
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.name || '')) return null
    if (typeof value.description !== 'string' || !value.description.trim()) return null
    return value
  } catch {
    return null
  }
}

function validPreset(text) {
  try {
    const rows = parseYaml(text, { logLevel: 'silent' })
    const validRows = value => Array.isArray(value) && value.every(row => {
      if (!row || typeof row !== 'object' || Array.isArray(row) || typeof row.name !== 'string' || !row.name.trim()) return false
      return row.group !== true || validRows(row.config)
    })
    return validRows(rows)
  } catch {
    return false
  }
}

function localModuleEvidencePaths(artifactBase, declared) {
  const normalized = declared.replace(/^\.\//, '')
  if (!normalized || normalized.startsWith('/') || normalized.split('/').includes('..')) return []
  const candidates = new Set([normalized])
  const addAlternates = value => {
    const stem = value.replace(/\.[cm]?[jt]sx?$/, '')
    if (stem !== value) {
      for (const suffix of ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.mts', '.cts']) candidates.add(stem + suffix)
    } else {
      for (const suffix of ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.mts', '.cts']) candidates.add(value + suffix)
      for (const suffix of ['index.ts', 'index.tsx', 'index.js', 'index.mjs', 'index.cjs']) candidates.add(`${value}/${suffix}`)
    }
  }
  addAlternates(normalized)
  const mapped = normalized.replace(/^(?:lib|dist|build)\//, 'src/')
  if (mapped !== normalized) {
    candidates.add(mapped)
    addAlternates(mapped)
  }
  const existing = [...candidates].filter(path => {
    const absolute = join(artifactBase, path)
    return existsSync(absolute) && statSync(absolute).isFile()
  })
  const source = existing.filter(path => path.startsWith('src/'))
  return source.length ? source : existing
}

function resolveBundlePatch(artifactBase, patch) {
  const normalizedPatch = patch.replace(/^\.\//, '')
  if (!normalizedPatch || isAbsolute(normalizedPatch) || normalizedPatch.split('/').includes('..')) {
    return { patch, expected: normalizedPatch, exists: false, yamlValid: false, localModules: [] }
  }
  const patchPath = join(artifactBase, normalizedPatch)
  if (!existsSync(patchPath) || !statSync(patchPath).isFile()) {
    return { patch, expected: normalizedPatch, exists: false, yamlValid: false, localModules: [] }
  }
  let document
  try {
    document = parseYaml(readText(patchPath), { logLevel: 'silent' })
  } catch {
    return { patch, expected: normalizedPatch, exists: false, yamlValid: false, localModules: [] }
  }
  if (!Array.isArray(document)) return { patch, expected: normalizedPatch, exists: false, yamlValid: false, localModules: [] }
  const declaredModules = []
  for (const operation of document) {
    if (!operation || typeof operation !== 'object' || !Array.isArray(operation.insert)) continue
    for (const row of operation.insert) {
      if (row && typeof row === 'object' && typeof row.name === 'string' && row.name.startsWith('.')) declaredModules.push(row.name)
    }
  }
  const localModules = declaredModules.map(declared => {
    const absolutePath = resolve(dirname(patchPath), declared)
    const relativePath = relative(artifactBase, absolutePath).replaceAll('\\', '/')
    const inArtifact = relativePath && relativePath !== '..' && !relativePath.startsWith('../')
    const evidencePaths = inArtifact ? localModuleEvidencePaths(artifactBase, relativePath) : []
    return { declared, relativePath, evidencePaths, exists: evidencePaths.length > 0 }
  })
  return {
    patch,
    expected: normalizedPatch,
    exists: localModules.every(item => item.exists),
    yamlValid: true,
    localModules
  }
}

function dependencyNames(pkg) {
  return Object.keys({
    ...(pkg.dependencies || {}),
    ...(pkg.peerDependencies || {})
  })
}

function stringValues(value) {
  if (typeof value === 'string') return [value]
  if (!value || typeof value !== 'object' || Array.isArray(value)) return []
  return Object.values(value).flatMap(stringValues)
}

function declaredRootEntries(pkg) {
  const values = [pkg.main, pkg.module].filter(value => typeof value === 'string')
  const exports = pkg.exports
  if (typeof exports === 'string') values.push(exports)
  else if (exports && typeof exports === 'object' && !Array.isArray(exports)) {
    if (Object.hasOwn(exports, '.')) values.push(...stringValues(exports['.']))
    else if (!Object.keys(exports).some(key => key.startsWith('.'))) values.push(...stringValues(exports))
  }
  return values.filter(value => !/\.d\.[cm]?ts$/.test(value))
}

function sourceEntryCandidates(pkg) {
  const candidates = new Set()
  for (const declared of declaredRootEntries(pkg)) {
    const normalized = declared.replace(/^\.\//, '')
    if (normalized.startsWith('/') || normalized.split('/').includes('..')) continue
    const bases = new Set([normalized, normalized.replace(/^(?:lib|dist|build)\//, 'src/')])
    for (const base of bases) {
      candidates.add(base)
      if (/\.[cm]?js$/.test(base)) {
        const stem = base.replace(/\.[cm]?js$/, '')
        for (const suffix of ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.mts', '.cts']) candidates.add(stem + suffix)
      }
    }
  }
  return candidates
}

function hasSourceCounterpart(artifactBase, path) {
  const mapped = path.replace(/^(?:lib|dist|build)\//, 'src/')
  if (mapped === path) return false
  const stem = mapped.replace(/\.[cm]?js$/, '')
  return [mapped, `${stem}.ts`, `${stem}.tsx`, `${stem}.js`, `${stem}.mjs`, `${stem}.cjs`, `${stem}.mts`, `${stem}.cts`]
    .some(candidate => existsSync(join(artifactBase, candidate)))
}

function moduleSpecifier(declaration) {
  let node = declaration
  while (node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) return node.moduleSpecifier.text
    node = node.parent
  }
  return null
}

function cordisServiceSymbol(symbol, checker, seen = new Set()) {
  if (!symbol || seen.has(symbol)) return false
  seen.add(symbol)
  for (const declaration of symbol.declarations || []) {
    const specifier = moduleSpecifier(declaration)
    if (specifier === '@deepseek-ai/cordis') {
      if (ts.isImportSpecifier(declaration) && (declaration.propertyName || declaration.name).text === 'Service') return true
      if (ts.isExportSpecifier(declaration) && (declaration.propertyName || declaration.name).text === 'Service') return true
      if (ts.isNamespaceImport(declaration)) return true
    }
    if (declaration.getSourceFile().fileName.includes('/node_modules/@deepseek-ai/cordis/')) return true
    if (ts.isClassDeclaration(declaration) && declaration.heritageClauses?.some(clause => clause.token === ts.SyntaxKind.ExtendsKeyword
      && clause.types.some(type => cordisServiceExpression(type.expression, checker, seen)))) return true
  }
  if (symbol.flags & ts.SymbolFlags.Alias) return cordisServiceSymbol(checker.getAliasedSymbol(symbol), checker, seen)
  return false
}

function cordisServiceExpression(expression, checker, seen = new Set()) {
  if (ts.isPropertyAccessExpression(expression)) {
    if (expression.name.text !== 'Service') return false
    return cordisServiceSymbol(checker.getSymbolAtLocation(expression.expression), checker, seen)
  }
  return cordisServiceSymbol(checker.getSymbolAtLocation(expression), checker, seen)
}

function isCordisServiceClass(node, checker) {
  return Boolean(node.heritageClauses?.some(clause => clause.token === ts.SyntaxKind.ExtendsKeyword
    && clause.types.some(type => cordisServiceExpression(type.expression, checker))))
}

function unaliased(symbol, checker) {
  let current = symbol
  const seen = new Set()
  while (current && (current.flags & ts.SymbolFlags.Alias) && !seen.has(current)) {
    seen.add(current)
    current = checker.getAliasedSymbol(current)
  }
  return current || symbol
}

function callableSymbol(symbol, checker, location) {
  const target = unaliased(symbol, checker)
  const declaration = target.valueDeclaration || target.declarations?.[0] || location
  const type = checker.getTypeOfSymbolAtLocation(target, declaration)
  return checker.getSignaturesOfType(type, ts.SignatureKind.Call).length > 0
}

function constructableSymbol(symbol, checker, location) {
  const target = unaliased(symbol, checker)
  const declaration = target.valueDeclaration || target.declarations?.[0] || location
  const type = checker.getTypeOfSymbolAtLocation(target, declaration)
  return checker.getSignaturesOfType(type, ts.SignatureKind.Construct).length > 0
}

function pluginObjectSymbol(symbol, checker, location) {
  const target = unaliased(symbol, checker)
  const declaration = target.valueDeclaration || target.declarations?.[0] || location
  const type = checker.getTypeOfSymbolAtLocation(target, declaration)
  const apply = type.getProperty('apply')
  return Boolean(apply && callableSymbol(apply, checker, declaration))
}

function serviceSymbol(symbol, checker) {
  const target = unaliased(symbol, checker)
  return Boolean(target.declarations?.some(declaration => ts.isClassDeclaration(declaration) && isCordisServiceClass(declaration, checker)))
}

function pluginExpression(expression, checker) {
  const type = checker.getTypeAtLocation(expression)
  if (checker.getSignaturesOfType(type, ts.SignatureKind.Call).length > 0) return true
  if (checker.getSignaturesOfType(type, ts.SignatureKind.Construct).length > 0) return true
  const apply = type.getProperty('apply')
  return Boolean(apply && callableSymbol(apply, checker, expression))
}

function assignmentPath(expression) {
  if (ts.isIdentifier(expression)) return expression.text
  if (ts.isPropertyAccessExpression(expression)) {
    const parent = assignmentPath(expression.expression)
    return parent ? `${parent}.${expression.name.text}` : null
  }
  return null
}

function hasCommonJsPluginExport(sourceFile, checker) {
  let found = false
  const visit = node => {
    if (found) return
    if (ts.isExportAssignment(node) && node.isExportEquals && pluginExpression(node.expression, checker)) {
      found = true
      return
    }
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      const path = assignmentPath(node.left)
      if ((path === 'module.exports' || path === 'module.exports.default' || path === 'exports.default') && pluginExpression(node.right, checker)) {
        found = true
        return
      }
      if ((path === 'module.exports.apply' || path === 'exports.apply') && checker.getSignaturesOfType(checker.getTypeAtLocation(node.right), ts.SignatureKind.Call).length > 0) {
        found = true
        return
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return found
}

function hasCordisPluginExport(paths) {
  if (!paths.length) return false
  const program = ts.createProgram(paths, {
    allowJs: true,
    checkJs: false,
    jsx: ts.JsxEmit.Preserve,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    skipLibCheck: true,
    target: ts.ScriptTarget.Latest
  })
  const checker = program.getTypeChecker()
  return paths.some(path => {
    const sourceFile = program.getSourceFile(path)
    const module = sourceFile && checker.getSymbolAtLocation(sourceFile)
    if (!sourceFile || !module) return false
    const exports = checker.getExportsOfModule(module)
    const apply = exports.find(symbol => symbol.getName() === 'apply')
    const defaultExport = exports.find(symbol => symbol.getName() === 'default')
    return Boolean((apply && callableSymbol(apply, checker, sourceFile))
      || (defaultExport && (callableSymbol(defaultExport, checker, sourceFile)
        || constructableSymbol(defaultExport, checker, sourceFile)
        || pluginObjectSymbol(defaultExport, checker, sourceFile)
        || serviceSymbol(defaultExport, checker)))
      || hasCommonJsPluginExport(sourceFile, checker))
  })
}

export function inspectRepository(root, metadata = {}) {
  const rootIsFile = statSync(root).isFile()
  const artifactBase = rootIsFile ? dirname(root) : root
  const files = rootIsFile ? [root] : walk(root)
  const rel = path => relative(artifactBase, path).replaceAll('\\', '/')
  const byBase = new Map()
  for (const path of files) {
    const name = basename(path)
    if (!byBase.has(name)) byBase.set(name, [])
    byBase.get(name).push(path)
  }

  const packages = (byBase.get('package.json') || [])
    .map(path => ({ path: rel(path), value: readJson(path) }))
    .filter(item => item.value)

  const rootPackage = packages.find(item => item.path === 'package.json') || null
  const rootPkg = rootPackage?.value || {}
  const bundlePatch = rootPkg?.dsh?.bundle?.patch
  const bundles = typeof bundlePatch === 'string' ? [{ manifest: 'package.json', patch: bundlePatch }] : []
  const bundlePatchResolution = bundles.map(bundle => ({
    ...bundle,
    ...resolveBundlePatch(artifactBase, bundle.patch)
  }))

  const rootSkillPath = rootIsFile && extname(root).toLowerCase() === '.md'
    ? root
    : files.find(path => rel(path) === 'SKILL.md')
  const rootSkillText = rootSkillPath ? readText(rootSkillPath) : ''
  const skills = parseSkill(rootSkillText) ? [rel(rootSkillPath)] : []
  const rootPresetPath = rootIsFile && /^agent\.cordis\.ya?ml$/i.test(basename(root))
    ? root
    : files.find(path => rel(path) === 'agent.cordis.yml')
  const rootPresetText = rootPresetPath ? readText(rootPresetPath) : ''
  const presets = rootPresetPath && validPreset(rootPresetText) ? [rel(rootPresetPath)] : []
  const patchFiles = [...(byBase.get('cordis.patch.yml') || []), ...(byBase.get('cordis.patch.yaml') || [])].map(rel)
  let readmePath = [...(byBase.get('README.md') || []), ...(byBase.get('README.zh.md') || [])]
    .sort((a, b) => rel(a).split('/').length - rel(b).split('/').length)[0]
  if (!readmePath && rootSkillPath) readmePath = rootSkillPath
  const readme = readmePath ? readText(readmePath) : ''
  const entryCandidates = sourceEntryCandidates(rootPkg)
  const declaredEntryPaths = [...entryCandidates]
    .map(path => join(artifactBase, path))
    .filter(path => existsSync(path) && statSync(path).isFile())
    .filter(path => !hasSourceCounterpart(artifactBase, rel(path)))
  const bundleModulePaths = bundlePatchResolution
    .flatMap(item => item.localModules.flatMap(module => module.evidencePaths))
    .map(path => join(artifactBase, path))
  const sourcePaths = [...new Set([
    ...files.filter(path => /\.(?:[cm]?[jt]sx?|vue|svelte|sh|py)$/.test(path)),
    ...declaredEntryPaths.filter(path => /\.(?:[cm]?[jt]sx?)$/.test(path)),
    ...bundleModulePaths.filter(path => /\.(?:[cm]?[jt]sx?)$/.test(path))
  ])]
  const testPaths = files.filter(path => /(?:^|\/)(?:test|tests|__tests__)(?:\/|$)|\.(?:spec|test)\.[cm]?[jt]sx?$/.test(rel(path)))
  const sourceText = readCombined(sourcePaths, 'source')
  const entrySourcePaths = sourcePaths.filter(path => entryCandidates.has(rel(path)))
  const testText = readCombined(testPaths, 'test')
  const allPackageScripts = Object.entries(rootPkg.scripts || {})
  const topics = metadata.topics || []

  const rootDeps = dependencyNames(rootPkg)
  const hasDshRuntimeDependency = rootDeps.includes('@deepseek-ai/cordis') || rootDeps.some(name => name.startsWith('@deepseek-ai/dsh-'))
  const keywords = Array.isArray(rootPkg.keywords) ? rootPkg.keywords : []
  const declaresPluginIntent = /^@deepseek-ai\/dsh-/.test(rootPkg.name || '')
    || keywords.some(value => /^(?:dsh-plugin|deepseek-harness)$/i.test(value))
    || topics.includes('dsh-plugin')
  const hasPackageEntry = declaredRootEntries(rootPkg).length > 0
  const hasCordisEntry = hasCordisPluginExport(entrySourcePaths)
  const nativePackages = !bundles.length && rootPackage && hasDshRuntimeDependency && declaresPluginIntent && hasPackageEntry && hasCordisEntry
    ? [{ manifest: 'package.json', name: rootPkg.name || null }]
    : []

  const types = []
  if (bundles.length) types.push('bundle')
  else if (nativePackages.length) types.push('native-plugin')
  else if (skills.length) types.push('skill')
  else if (presets.length) types.push('preset')
  if (!types.length && /DeepSeek Harness|\bDSH\b|dsh-plugin/i.test(readme)) types.push('external-integration')
  if (!types.length && topics.includes('dsh-plugin')) types.push('topic-only')
  if (!types.length) types.push('unrelated')

  const hasNetworkCode = /\bfetch\s*\(|https?:\/\/|\bWebSocket\b|\baxios\b|\bnode:https?\b/.test(sourceText)
  const hasCredentialCode = /process\.env|API[_-]?KEY|TOKEN|credential|secret/i.test(sourceText)
  const hasUnmanagedResource = /setInterval\s*\(|fs\.watch\s*\(|watchFile\s*\(|new WebSocket\s*\(|createServer\s*\(/.test(sourceText)
  const hasLifecycleCleanup = /ctx\.(?:effect|on)\s*\(|return\s+(?:async\s*)?\(?.*=>|clearInterval\s*\(|\.dispose\s*\(/s.test(sourceText)
  const secretScanPaths = [...new Set([
    ...sourcePaths,
    ...(rootPackage ? [join(artifactBase, rootPackage.path)] : []),
    ...bundlePatchResolution.filter(item => item.yamlValid).map(item => join(artifactBase, item.expected)),
    ...(rootPresetPath ? [rootPresetPath] : []),
    ...(rootSkillPath ? [rootSkillPath] : [])
  ])]
  const testPathSet = new Set(testPaths.map(rel))
  const embeddedSecrets = secretScanPaths
    .filter(path => !testPathSet.has(rel(path)))
    .filter(path => /\bsk-[A-Za-z0-9_-]{20,}\b|AKIA[0-9A-Z]{16}/.test(readText(path)))
    .map(rel)
  const scoredSupportPaths = files.filter(path => /^(?:\.github\/workflows\/[^/]+\.ya?ml)$|(?:^|\/)(?:pnpm-lock\.yaml|package-lock\.json|yarn\.lock|bun\.lockb?|uv\.lock|poetry\.lock|LICENSE|LICENSE\.md|COPYING|CHANGELOG(?:\.md)?|HISTORY(?:\.md)?|SECURITY\.md|SECURITY)$/i.test(rel(path)))
  const scoredPaths = [...new Set([
    ...(rootPackage ? [rootPackage.path] : []),
    ...bundlePatchResolution.filter(item => item.yamlValid).map(item => item.expected),
    ...bundlePatchResolution.flatMap(item => item.localModules.flatMap(module => module.evidencePaths.length ? module.evidencePaths : [module.relativePath])),
    ...skills,
    ...presets,
    ...(readmePath ? [rel(readmePath)] : []),
    ...sourcePaths.map(rel),
    ...testPaths.map(rel),
    ...scoredSupportPaths.map(rel)
  ])]

  return {
    root,
    files: files.map(rel),
    packages,
    bundles,
    bundlePatchResolution,
    nativePackages,
    skills,
    presets,
    patchFiles,
    types,
    readme,
    readmePath: readmePath ? rel(readmePath) : null,
    sourceText,
    entryPaths: entrySourcePaths.map(rel),
    scoredPaths,
    sourceFileCount: sourcePaths.length,
    testText,
    testPaths: testPaths.map(rel),
    hasTests: testPaths.length > 0,
    hasCi: files.some(path => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(rel(path))),
    hasLockfile: files.some(path => /(?:^|\/)(?:pnpm-lock\.yaml|package-lock\.json|yarn\.lock|bun\.lockb?|uv\.lock|poetry\.lock)$/.test(rel(path))),
    hasLicense: files.some(path => /(?:^|\/)(?:LICENSE|LICENSE\.md|COPYING)$/i.test(rel(path))) || Boolean(rootPkg.license),
    hasChangelog: files.some(path => /(?:^|\/)(?:CHANGELOG|HISTORY)(?:\.md)?$/i.test(rel(path))),
    hasSecurityPolicy: files.some(path => /(?:^|\/)(?:SECURITY\.md|SECURITY)$/i.test(rel(path))),
    hasNetworkCode,
    hasCredentialCode,
    hasUnmanagedResource,
    hasLifecycleCleanup,
    embeddedSecrets,
    allPackageScripts,
    topics
  }
}
