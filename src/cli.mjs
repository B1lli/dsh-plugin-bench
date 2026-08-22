#!/usr/bin/env node
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { inspectRepository } from './inspect.mjs'
import { scoreInspection } from './score.mjs'
import { renderReport } from './render.mjs'
import { createRuntimeTemplate } from './runtime-template.mjs'

const PACKAGE = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const FORMATS = new Set(['text', 'json', 'markdown', 'badge'])

function usage() {
  return `DSH Plugin Bench ${PACKAGE.version}

Evidence-backed quality scorecards for DeepSeek Harness plugins.

Usage:
  dsh-plugin-bench <path|owner/repo|github-url> [options]

Options:
  --ref <sha>                 Pin a full Git commit
  --artifact <path>           Select one artifact inside a monorepo
  --runtime <file>            Add commit-bound E2–E5 evidence
  --runtime-template <file>   Create a bound evidence template without overwriting
  --identity <label>          Attach non-scoring identity metadata
  --evaluated-at <ISO>        Pin the accounting time
  --format <name>             text, json, markdown, or badge
  --json                      Alias for --format json
  --output, -o <file>         Write the scorecard; .json/.md/.svg infers format
  --force                     Allow overwriting explicit output files
  --help, -h                  Show this help
  --version, -v               Show the version

Examples:
  dsh-plugin-bench owner/repo
  dsh-plugin-bench owner/repo --ref <sha> --output scorecard.md
  dsh-plugin-bench ./plugin --runtime-template runtime-evidence.json
  dsh-plugin-bench ./plugin --format badge --output dsh-quality.svg`
}

function sameFile(first, second) {
  if (!first || !second || first === '-' || second === '-') return false
  const firstPath = resolve(first)
  const secondPath = resolve(second)
  if (firstPath === secondPath) return true
  if (!existsSync(firstPath) || !existsSync(secondPath)) return false
  const firstStat = statSync(firstPath)
  const secondStat = statSync(secondPath)
  return firstStat.dev === secondStat.dev && firstStat.ino === secondStat.ino
}

function parseArgs(argv) {
  const options = { format: null, runtime: null, runtimeTemplate: null, identity: null, ref: null, artifact: null, evaluatedAt: null, output: null, force: false, help: false, version: false, target: null }
  const takeValue = (name, index) => {
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) throw new Error(`${name} requires a value`)
    return value
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') options.help = true
    else if (arg === '--version' || arg === '-v') options.version = true
    else if (arg === '--json') options.format = 'json'
    else if (arg === '--format' || arg === '-f') { options.format = takeValue(arg, i); i += 1 }
    else if (arg === '--output' || arg === '-o') { options.output = takeValue(arg, i); i += 1 }
    else if (arg === '--runtime-template') { options.runtimeTemplate = takeValue(arg, i); i += 1 }
    else if (arg === '--force') options.force = true
    else if (arg === '--runtime') { options.runtime = takeValue(arg, i); i += 1 }
    else if (arg === '--identity') { options.identity = takeValue(arg, i); i += 1 }
    else if (arg === '--ref') { options.ref = takeValue(arg, i); i += 1 }
    else if (arg === '--artifact') { options.artifact = takeValue(arg, i); i += 1 }
    else if (arg === '--evaluated-at') { options.evaluatedAt = takeValue(arg, i); i += 1 }
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`)
    else if (!options.target) options.target = arg
    else throw new Error(`unexpected argument: ${arg}`)
  }
  if (options.format && !FORMATS.has(options.format)) throw new Error(`--format must be one of: ${[...FORMATS].join(', ')}`)
  if (sameFile(options.output, options.runtimeTemplate)) throw new Error('--output and --runtime-template must use different files')
  for (const [name, path] of [['--output', options.output], ['--runtime-template', options.runtimeTemplate]]) {
    if (sameFile(options.runtime, path)) throw new Error(`--runtime and ${name} must use different files`)
  }
  return options
}

function outputFormat(options) {
  if (options.format) return options.format
  const extension = extname(options.output || '').toLowerCase()
  if (extension === '.json') return 'json'
  if (extension === '.md' || extension === '.markdown') return 'markdown'
  if (extension === '.svg') return 'badge'
  return 'text'
}

function renderOptions(options, format) {
  if (format !== 'markdown' || !options.output || options.output === '-') return {}
  const prefix = relative(dirname(resolve(options.output)), process.cwd()).replaceAll('\\', '/')
  return { evidenceHrefPrefix: prefix ? `${prefix}/` : '' }
}

function writeOutput(path, value, force) {
  if (!path || path === '-') {
    process.stdout.write(value.endsWith('\n') ? value : `${value}\n`)
    return
  }
  const absolute = resolve(path)
  mkdirSync(dirname(absolute), { recursive: true })
  try {
    writeFileSync(absolute, value.endsWith('\n') ? value : `${value}\n`, { encoding: 'utf8', flag: force ? 'w' : 'wx' })
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`${absolute} already exists; use --force to overwrite`)
    throw error
  }
  console.error(`wrote ${absolute}`)
}

function githubRepo(target) {
  const match = target.match(/^(?:https?:\/\/github\.com\/)?([^/\s]+)\/([^/#\s]+?)(?:\.git)?$/)
  return match ? `${match[1]}/${match[2]}` : null
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options })
  if (result.status !== 0) throw new Error(`${command} failed: ${(result.stderr || result.stdout).trim()}`)
  return result.stdout.trim()
}

function githubMetadata(repo) {
  try {
    const raw = run('gh', ['api', `repos/${repo}`])
    const value = JSON.parse(raw)
    return {
      target: repo,
      stars: value.stargazers_count,
      forks: value.forks_count,
      topics: value.topics || []
    }
  } catch {
    return { target: repo }
  }
}

function githubPathCommitAt(repo, commit, artifact) {
  if (!commit || !artifact || artifact === '.') return null
  try {
    const endpoint = `repos/${repo}/commits?sha=${encodeURIComponent(commit)}&path=${encodeURIComponent(artifact)}&per_page=1`
    const values = JSON.parse(run('gh', ['api', endpoint]))
    return values[0]?.commit?.committer?.date || values[0]?.commit?.author?.date || null
  } catch {
    return null
  }
}

function localCommit(path) {
  try { return run('git', ['-C', path, 'rev-parse', 'HEAD']) } catch { return null }
}

function localMetadata(repoRoot, target, artifact) {
  let commitAt = null
  try { commitAt = run('git', ['-C', repoRoot, 'log', '-1', '--format=%cI', '--', artifact]) } catch {}
  return { target, commit: localCommit(repoRoot), commitAt }
}

function artifactRoot(repoRoot, artifact) {
  if (!artifact || artifact === '.') return repoRoot
  const resolved = resolve(repoRoot, artifact)
  const rel = relative(repoRoot, resolved)
  if (!rel || rel === '..' || rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`)) throw new Error(`invalid artifact path: ${artifact}`)
  if (!existsSync(resolved)) throw new Error(`artifact path not found: ${artifact}`)
  return resolved
}

function gitTopLevel(path) {
  const base = statSync(path).isFile() ? resolve(path, '..') : path
  try { return realpathSync(run('git', ['-C', base, 'rev-parse', '--show-toplevel'])) } catch { return null }
}

function relativeArtifact(repoRoot, path) {
  const value = relative(repoRoot, path).replaceAll('\\', '/')
  return value || '.'
}

function artifactDirty(repoRoot, artifact) {
  try { return Boolean(run('git', ['-C', repoRoot, 'status', '--porcelain', '--untracked-files=all', '--', artifact])) } catch { return false }
}

function absentFromCommit(repoRoot, commit, artifact, scoredPaths, artifactIsFile) {
  if (artifactIsFile) {
    const result = spawnSync('git', ['-C', repoRoot, 'cat-file', '-e', `${commit}:${artifact}`], { encoding: 'utf8' })
    return result.status === 0 ? [] : [artifact]
  }
  const prefix = artifact === '.' ? '' : `${artifact.replace(/\/$/, '')}/`
  const paths = scoredPaths.map(path => `${prefix}${path}`)
  if (artifact !== '.') paths.unshift(artifact)
  return paths.filter(path => {
    const result = spawnSync('git', ['-C', repoRoot, 'cat-file', '-e', `${commit}:${path}`], { encoding: 'utf8' })
    return result.status !== 0
  })
}

let options
try { options = parseArgs(process.argv.slice(2)) } catch (error) { console.error(error.message); console.error(usage()); process.exit(2) }
if (options.help || process.argv.length === 2) { console.log(usage()); process.exit(0) }
if (options.version) { console.log(PACKAGE.version); process.exit(0) }
if (!options.target) { console.error('a target is required'); console.error(usage()); process.exit(2) }

let root
let cleanup = null
let metadata = {}
let sourceRepoRoot = null
const repo = githubRepo(options.target)
try {
  if (existsSync(options.target)) {
    const targetPath = realpathSync(resolve(options.target))
    const repoRoot = gitTopLevel(targetPath)
    if (repoRoot) {
      const artifact = options.artifact || relativeArtifact(repoRoot, targetPath)
      root = artifactRoot(repoRoot, artifact)
      metadata = localMetadata(repoRoot, options.target, artifact)
      const dirty = artifactDirty(repoRoot, artifact)
      if (dirty && (options.ref || options.runtime)) throw new Error(`commit-bound scoring refuses dirty or untracked artifact: ${artifact}`)
      if (dirty) { metadata.commit = null; metadata.commitAt = null; metadata.workingTree = 'dirty' }
      if (options.ref && metadata.commit !== options.ref) throw new Error(`local target HEAD ${metadata.commit || 'unknown'} does not match --ref ${options.ref}`)
      metadata.artifact = artifact
      sourceRepoRoot = repoRoot
    } else {
      root = artifactRoot(targetPath, options.artifact)
      metadata = { target: options.target, commit: null, commitAt: null, artifact: options.artifact || '.' }
      if (options.ref) throw new Error('local --ref requires a Git checkout')
    }
  } else if (repo) {
    const temp = mkdtempSync(join(tmpdir(), 'dsh-plugin-bench-'))
    root = join(temp, basename(repo))
    run('git', ['clone', '--depth', '1', `https://github.com/${repo}.git`, root])
    if (options.ref) {
      run('git', ['-C', root, 'fetch', '--depth', '1', 'origin', options.ref])
      run('git', ['-C', root, 'checkout', '--detach', 'FETCH_HEAD'])
    }
    cleanup = () => rmSync(temp, { recursive: true, force: true })
    const artifact = options.artifact || '.'
    metadata = { ...githubMetadata(repo), ...localMetadata(root, repo, artifact), artifact }
    if (artifact !== '.') metadata.commitAt = githubPathCommitAt(repo, metadata.commit, artifact)
    sourceRepoRoot = root
    root = artifactRoot(root, artifact)
  } else {
    throw new Error(`target not found and not a GitHub repository: ${options.target}`)
  }
  metadata.identity = options.identity || 'UNPROVEN'
  metadata.evaluatedAt = options.evaluatedAt || null
  const runtime = options.runtime ? JSON.parse(readFileSync(options.runtime, 'utf8')) : null
  const inspection = inspectRepository(root, metadata)
  if (sourceRepoRoot && metadata.commit) {
    const absent = absentFromCommit(sourceRepoRoot, metadata.commit, metadata.artifact || '.', inspection.scoredPaths, statSync(root).isFile())
    if (absent.length && (options.ref || options.runtime)) throw new Error(`commit-bound scoring refuses artifact entries absent from commit: ${absent.join(', ')}`)
    if (absent.length) { metadata.commit = null; metadata.commitAt = null; metadata.workingTree = 'dirty' }
  }
  const report = scoreInspection(inspection, metadata, runtime)
  if (options.runtimeTemplate) writeOutput(options.runtimeTemplate, JSON.stringify(createRuntimeTemplate(report), null, 2), options.force)
  const format = outputFormat(options)
  writeOutput(options.output, renderReport(report, format, renderOptions(options, format)), options.force)
} catch (error) {
  console.error(`error: ${error.message}`)
  process.exitCode = 1
} finally {
  cleanup?.()
}
