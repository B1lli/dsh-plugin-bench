import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { requirePinnedSample } from '../src/target.mjs'
import { formatBadge, formatMarkdown } from '../src/render.mjs'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const suite = JSON.parse(readFileSync(join(projectRoot, 'samples/targets.json'), 'utf8'))
const targets = suite.targets
const reports = []

for (const sample of targets) {
  try {
    requirePinnedSample(sample)
  } catch (error) {
    reports.push({ sample, error: error.message })
    continue
  }
  const args = ['src/cli.mjs', sample.target, '--identity', sample.identity, '--json']
  args.push('--ref', sample.commit)
  if (sample.artifact) args.push('--artifact', sample.artifact)
  args.push('--evaluated-at', suite.evaluatedAt)
  const runtimePath = join(projectRoot, 'evidence', 'runtime', `${sample.label}.json`)
  try {
    readFileSync(runtimePath)
    args.push('--runtime', runtimePath)
  } catch {}
  const result = spawnSync(process.execPath, args, { cwd: projectRoot, encoding: 'utf8', maxBuffer: 30_000_000 })
  if (result.status !== 0) {
    reports.push({ sample, error: (result.stderr || result.stdout).trim() })
    continue
  }
  const report = JSON.parse(result.stdout)
  if (report.commit !== sample.commit) {
    reports.push({ sample, error: `commit mismatch: expected ${sample.commit}, got ${report.commit || 'none'}` })
    continue
  }
  const expectedArtifact = sample.artifact || '.'
  if (report.classification.artifact !== expectedArtifact) {
    reports.push({ sample, error: `artifact mismatch: expected ${expectedArtifact}, got ${report.classification.artifact || 'none'}` })
    continue
  }
  if (report.evaluatedAt !== suite.evaluatedAt) {
    reports.push({ sample, error: `evaluatedAt mismatch: expected ${suite.evaluatedAt}, got ${report.evaluatedAt || 'none'}` })
    continue
  }
  if (!Number.isFinite(Date.parse(report.commitAt))) {
    reports.push({ sample, error: `commitAt missing or invalid: ${report.commitAt || 'none'}` })
    continue
  }
  reports.push({ sample, report })
}

mkdirSync(join(projectRoot, 'reports'), { recursive: true })
const generatedAt = new Date().toISOString()
writeFileSync(join(projectRoot, 'reports', 'benchmark.json'), JSON.stringify({ schema: 'dsh-plugin-bench/batch-v1', generatedAt, evaluatedAt: suite.evaluatedAt, reports }, null, 2) + '\n')

const lines = [
  '# DSH Plugin Bench — pilot benchmark',
  '',
  `Generated: ${generatedAt}`,
  '',
  '> Scores below are quality evidence intervals. Stars are adoption signals only and do not affect the score. “暂定” means evidence coverage is below 80%.',
  '',
  '| Sample | Cohort | Type | Quality interval | Coverage | Grade | Repo Stars | Identity |',
  '|---|---|---|---:|---:|---|---:|---|'
]
for (const item of reports) {
  if (item.error) {
    lines.push(`| ${item.sample.label} | ${item.sample.cohort} | ERROR | — | — | ${item.error.replaceAll('|', '\\|').slice(0, 120)} | — | ${item.sample.identity} |`)
    continue
  }
  const report = item.report
  const quality = report.quality ? `${report.quality.confirmed}–${report.quality.upper}` : 'NOT_A_PLUGIN'
  const coverage = report.quality ? `${report.quality.coverage}%` : '—'
  const grade = report.quality?.grade || '排除'
  lines.push(`| ${item.sample.label} | ${item.sample.cohort} | ${report.classification.types.join(' + ')} | ${quality} | ${coverage} | ${grade} | ${report.adoption.stars ?? '—'} | ${report.identity} |`)
}

lines.push('', '## Evidence gaps and failures', '')
for (const item of reports) {
  if (!item.report?.quality) continue
  const relevant = item.report.checks.filter(check => check.status === 'FAIL' || check.status === 'UNPROVEN')
  lines.push(`### ${item.sample.label}`, '')
  for (const check of relevant) lines.push(`- ${check.status} \`${check.id}\`: ${check.summary}`)
  lines.push('')
}
lines.push('## Runtime evidence ledger', '', '> These entries are operator-supplied attestations bound to the exact commit and artifact shown in benchmark.json.', '')
for (const item of reports) {
  if (!item.report?.quality) continue
  const runtimeBacked = item.report.checks.filter(check => /^E[2-5]$/.test(check.level) && check.status !== 'UNPROVEN')
  if (!runtimeBacked.length) continue
  lines.push(`### ${item.sample.label}`, '')
  for (const check of runtimeBacked) {
    const evidence = check.evidence?.length ? ` — ${check.evidence.join('; ')}` : ''
    lines.push(`- ${check.status} ${check.level} \`${check.id}\`: ${check.summary}${evidence}`)
  }
  lines.push('')
}
writeFileSync(join(projectRoot, 'reports', 'benchmark.md'), lines.join('\n').trimEnd() + '\n')
const scorecardsRoot = join(projectRoot, 'reports', 'scorecards')
mkdirSync(scorecardsRoot, { recursive: true })
const scorecardIndex = ['# Shareable scorecards', '', '> Each card is bound to the commit, artifact, evaluation time, and evidence coverage shown inside it.', '']
for (const item of reports) {
  if (!item.report) continue
  const markdownName = `${item.sample.label}.md`
  const badgeName = `${item.sample.label}.svg`
  writeFileSync(join(scorecardsRoot, markdownName), `${formatMarkdown(item.report, { evidenceHrefPrefix: '../../' })}\n`)
  writeFileSync(join(scorecardsRoot, badgeName), `${formatBadge(item.report)}\n`)
  scorecardIndex.push(`- [${item.sample.label}](./${markdownName}) — [badge](./${badgeName})`)
}
writeFileSync(join(scorecardsRoot, 'README.md'), `${scorecardIndex.join('\n')}\n`)
console.log(`wrote benchmark reports and ${reports.filter(item => item.report).length} shareable scorecards for ${reports.length} samples`)
if (reports.some(item => item.error)) process.exitCode = 1
