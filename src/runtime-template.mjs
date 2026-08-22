import { readFileSync } from 'node:fs'
import { platform, release } from 'node:os'

const RUBRIC = JSON.parse(readFileSync(new URL('../rubric.json', import.meta.url), 'utf8'))

export function createRuntimeTemplate(report) {
  if (!report.classification.eligible) throw new Error('runtime template requires a loadable DSH artifact')
  if (!/^[0-9a-f]{40}$/i.test(report.commit || '')) throw new Error('runtime template requires a full 40-character inspected commit')
  const checks = Object.fromEntries(Object.entries(RUBRIC.runtimeMinimumEvidence).map(([id, level]) => [id, {
    status: 'UNPROVEN',
    level,
    summary: 'TODO: replace with the observed result and scope',
    evidence: []
  }]))
  return {
    schema: 'dsh-plugin-bench/runtime-evidence-v1',
    targetCommit: report.commit,
    targetArtifact: report.classification.artifact,
    environment: {
      dsh: '',
      node: process.version,
      os: `${platform()} ${release()}`,
      profile: '',
      isolatedDshHome: false
    },
    checks
  }
}
