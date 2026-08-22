# DSH Plugin Bench

Evidence-backed, type-aware quality scorecards for DeepSeek Harness plugins.

[简体中文](./README.zh-CN.md) · [Pilot benchmark](./reports/benchmark.md) · [Rubric](./rubric.json) · [Contributing](./CONTRIBUTING.md)

DSH Plugin Bench answers a narrower question than a directory or Stars leaderboard:

> For this exact plugin artifact and commit, what quality has actually been proven—and what is still unknown?

It distinguishes Bundles, native Cordis plugins, Skills, Presets, and repositories that merely carry the `dsh-plugin` topic. GitHub Stars and official-looking labels stay visible as adoption metadata but never change the quality score.

[![Example DSH quality scorecard](./reports/scorecards/dsh-score.svg)](./reports/scorecards/dsh-score.md)

_Example output for the pinned `dsh-score` pilot artifact; click the badge for its evidence ledger._

## Try it in 30 seconds

The source release is available on GitHub. The npm package is not published yet,
so run the CLI from a checkout:

```bash
npm ci
npm run score -- owner/repo
```

Create a shareable Markdown scorecard or SVG badge:

```bash
npm run score -- owner/repo --ref <40-char-commit> --output scorecard.md
npm run score -- owner/repo --ref <40-char-commit> --output dsh-quality.svg
```

The output format is inferred from `.json`, `.md`, or `.svg`. It can also be selected explicitly:

```bash
npm run score -- owner/repo --format text
npm run score -- owner/repo --format json --output report.json
npm run score -- owner/repo --format markdown --output report.md
npm run score -- owner/repo --format badge --output badge.svg
```

Run `npm run score -- --help` for every option. Existing files are not overwritten unless `--force` is provided.

## Turn unknowns into evidence

Static inspection is intentionally conservative. Test files, for example, prove only that tests exist—not that they passed. Generate an evidence template already bound to the inspected commit and artifact:

```bash
npm run score -- owner/repo \
  --ref <40-char-commit> \
  --artifact packages/your-plugin \
  --runtime-template runtime-evidence.json
```

Fill only checks you actually ran, then rescore:

```bash
npm run score -- owner/repo \
  --ref <40-char-commit> \
  --artifact packages/your-plugin \
  --runtime runtime-evidence.json \
  --output scorecard.md
```

E3+ evidence requires a real isolated DSH environment, non-empty DSH/Node/OS values, and the exact profile name. The generated template starts with an empty profile and `isolatedDshHome: false` so it cannot accidentally claim that proof. Leaving the template untouched never replaces findings already proven by static inspection.

## Read the score correctly

```text
quality: 73.2–90.7/100
coverage: 82.5%
grade: usable, with explicit trade-offs
```

- `PASS`: the evidence proves the check.
- `PARTIAL`: the evidence proves only part of it.
- `FAIL`: a reproducible failure is known.
- `UNPROVEN`: evidence is missing; it increases only the upper bound.
- `N/A`: the check does not apply to this artifact type.

Coverage below 80% remains **provisional / unranked**. A confirmed clean-install failure caps both ends at 39; a confirmed core-path failure caps them at 49; a major undisclosed boundary violation is `UNSAFE`. These are disclosed pilot governance thresholds, not statistically optimal constants.

## Eight dimensions

| Dimension | Weight |
|---|---:|
| Functional value and correct results | 20 |
| Install, activation, upgrade, removal | 12 |
| Native DSH integration and composition | 13 |
| Reliability and state integrity | 12 |
| Permissions, security, privacy | 15 |
| Performance and resource efficiency | 8 |
| UX and operability | 10 |
| Testing, release, maintenance | 10 |

The full executable contract is in [`rubric.json`](./rubric.json).

## Pilot results

The pilot covers 11 pinned samples across popular and small projects, an official built-in control, Bundle/native/Skill/Preset shapes, a monorepo attribution control, and a topic-contamination negative control.

- [Full benchmark](./reports/benchmark.md)
- [Shareable per-project cards and badges](./reports/scorecards/README.md)
- [Ecosystem gap analysis](./reports/ecosystem-gap.md)
- [Independent GPT review](./evidence/reviews/gpt-review-transcript.md)
- [Independent DeepSeek Harness review](./evidence/reviews/deepseek-final-review-transcript.md)

Only `dsh-score` crossed the 80% formal-coverage gate in the pilot. That does not make it “the best plugin”; it means the other samples need more commit-bound runtime evidence before comparison is responsible.

## Safety and provenance

- Remote source is cloned read-only; target code is not installed or executed by default.
- Shareable results expose the exact commit, artifact, evaluation time, and path-scoped artifact commit time.
- Runtime evidence must match the full 40-character commit and artifact.
- Manifests, Bundle patches, Presets, Skills, ESM/CommonJS runtime source, and `.mts/.cts` source are checked for common long-lived credential literals.
- Credentials must never be placed in reports, templates, issues, or fixtures.

See [`SECURITY.md`](./SECURITY.md) for reporting guidance.

## Release status

Version `0.2.0` is published as a GitHub source release. npm publication remains
pending because the release machine has no authenticated npm session; the package
name was still unclaimed when checked on 2026-08-22. The GitHub release does not
claim npm availability.

```bash
npm run check
npm run benchmark
npm run pack:check
```

MIT
