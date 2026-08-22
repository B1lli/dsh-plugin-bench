# dsh-score — normalized raw evidence

- Target: `PerryLink/dsh-score`
- Commit: `f2f173f520eea0aaeb35e93dc2e5298433a4bf26`
- Artifact: `.`
- Harness: `0.1.0-rc.8`
- Node: `22.22.0`
- OS: macOS
- Credential values: removed; provider key was injected from macOS Keychain

This file preserves the minimum command/result facts observed during the pilot. Temporary absolute paths and ANSI presentation bytes are normalized; result wording and counts are retained.

## engineering-verification

```text
$ pnpm install --frozen-lockfile
exit=0

$ pnpm run typecheck
exit=0

$ pnpm run typecheck:ci
exit=0

$ pnpm test
Test Files  13 passed (13)
Tests       91 passed (91)
exit=0
```

## clean-profile

```text
$ DSH_HOME=<isolated> dsh plugin --profile headless add <pinned dsh-score checkout>
exit=0

$ DSH_HOME=<isolated> dsh --profile headless --dump-config
# == dsh-score
id: score
exit=0

$ DSH_HOME=<isolated> dsh --profile web --host 127.0.0.1 --port 57713
$ curl -fsS http://127.0.0.1:57713/
<title>DSH Local Build</title>
```

## core-path

User task asked the DeepSeek agent to invoke the installed score tool against `PerryLink/dsh-score`.

```text
tool: score
target: PerryLink/dsh-score
result.total: 98
result.grade: A
result.health: healthy
result.installation: no-evidence
result.maintenance: pass (100)
result.documentation: pass (100)
result.security: pass (100)
result.compliance: pass (89)
```

The result is a successful functional invocation. The simultaneous `98/A` and `installation: no-evidence` observation is also why this benchmark does not renormalize unknown dimensions away.

## negative-path

```text
tool: score
target: ""
result.error: "dsh-score: target must be a non-empty string"
session_after_error: usable
```

## repeat-run-and-visible-result

```text
fresh_session_1: core-path completed with structured total/grade/dimensions
fresh_session_2: negative-path returned actionable error without terminating Harness
repeatability_verdict: UNPROVEN because these are different paths, each run once
visible_fields: total, grade, health, per-dimension evidence status
```

## permission-scope

```text
DSH_HOME: isolated
observed external operations: GitHub/npm read-only inspection
inspected checkout after run: unchanged
system-call-level audit: not performed
verdict: PARTIAL
```

## restart-remove

```text
restart activation: pass
dsh plugin remove dsh-score: dependency removed
profile bundle row after remove: dsh-score still present
next dump-config: failed to resolve removed bundle
attribution: Harness plugin-remove lifecycle, not plugin-specific
verdict: PARTIAL
```
