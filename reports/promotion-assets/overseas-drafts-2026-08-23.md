# Overseas channel drafts

These are channel-specific source drafts. A draft is counted as published only when its public URL is listed in the execution report.

## Hacker News

### Title

Show HN: Evidence-backed quality scorecards for DeepSeek Harness plugins

### URL

https://github.com/B1lli/dsh-plugin-bench

### Text

I built DSH Plugin Bench because plugin directories and Stars answer discovery questions, not whether one exact artifact and commit has proven its quality.

The CLI classifies Bundles, native Cordis plugins, Skills, Presets, and topic-only repositories, then produces a score interval plus an evidence ledger. Missing evidence remains UNPROVEN instead of being silently treated as failure or normalized away. Runtime credit is bound to the full commit, artifact, DSH/Node/OS, and profile.

The 0.2.0 pilot contains 11 pinned samples and eight lifecycle dimensions. Only one sample crossed the 80% evidence-coverage gate; that is a coverage result, not a “best plugin” claim. Stars and identity are adoption metadata and never change the quality score. This is an independent project, not an official DeepSeek release.

The source release is public; npm is still pending, so the current try-it path is `npm ci` followed by `npm run score -- owner/repo` from a checkout.

I would value feedback on whether the evidence states and score interval are legible, and which runtime checks are realistic for plugin maintainers to reproduce in an isolated DSH profile.

## Reddit r/DeepSeek (published version)

### Title

A type-aware scorecard for evaluating DSH plugins

### Body

Self-promotion disclosure: I maintain this open-source project.

I wanted a way to inspect a DeepSeek Harness plugin without turning GitHub Stars or an “official-looking” label into a quality score. DSH Plugin Bench evaluates one exact artifact and full commit, separates Bundle, native Cordis plugin, Skill, and Preset shapes, and reports PASS, PARTIAL, FAIL, UNPROVEN, or N/A across eight lifecycle dimensions.

The main use case is release review: check functional behavior, install/activation/upgrade/removal, native integration, reliability, permissions, performance, operability, and maintenance evidence without hiding missing runtime proof. UNPROVEN stays visible and widens the score interval instead of being normalized into a confident point score. Stars and identity are adoption metadata only.

The 0.2.0 source release includes an 11-sample pilot. Only one sample crossed the preset 80% formal-coverage gate; that is not a “best plugin” claim, just a signal that the remaining samples need more commit-bound runtime evidence before comparison is responsible.

Source and scorecards: https://github.com/B1lli/dsh-plugin-bench

npm is not published yet, so the honest quick start is from a checkout. I would especially value feedback from DSH plugin maintainers: which runtime-evidence checks are useful, and which are too costly to reproduce?

## DEV Community

### Title

Building evidence-backed quality scorecards for DeepSeek Harness plugins

### Tags

opensource, ai, testing, devtools

### Description

A commit-bound, type-aware approach to plugin quality that keeps missing evidence visible.

### Body outline

1. Why Stars and repository labels cannot answer plugin-quality questions.
2. Why Bundle, Cordis plugin, Skill, and Preset need different applicability checks.
3. The five evidence states and why UNPROVEN must not be collapsed into FAIL.
4. Binding every claim to artifact, full commit, evaluation time, and runtime environment.
5. The eight lifecycle dimensions and the 80% formal-coverage gate.
6. What the 11-sample pilot proves and what it does not prove.
7. Try from source and contribute runtime evidence.

Canonical link: https://github.com/B1lli/dsh-plugin-bench

## Hashnode

### Title

What a plugin quality score should prove: a commit-bound DSH scorecard

### Subtitle

How type-aware checks and explicit UNPROVEN gaps make plugin evaluation auditable.

### Suggested series

Open-source developer tools

### Canonical URL

https://github.com/B1lli/dsh-plugin-bench
