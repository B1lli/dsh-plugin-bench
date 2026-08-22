# Contributing

DSH Plugin Bench accepts rubric fixes, new artifact-shape fixtures, and pinned score requests. Quality evidence and popularity must remain separate.

## Request a score

Provide all of the following:

1. Repository URL.
2. Full 40-character commit.
3. Repository-relative artifact path, or `.`.
4. Expected artifact type: Bundle, native plugin, Skill, or Preset.
5. First-party identity evidence, if claiming official or beta status.
6. Runtime evidence only when it names the exact commit, artifact, DSH version, Node version, OS, profile, and isolated `DSH_HOME` state.

Never include API keys, access tokens, private repository URLs, user data, or unredacted command output.

## Local workflow

```bash
npm ci
npm run check
npm run score -- ./path/to/plugin
```

When changing classification, scoring, provenance, or rendering:

1. Add a positive fixture for the supported path.
2. Add a neighboring negative fixture that must not qualify.
3. Run `npm run check`.
4. Run `npm run benchmark` if any report field or score can change.
5. Run `npm run pack:check` if package contents or CLI behavior changed.

## Evidence rules

- Missing evidence is `UNPROVEN`, not `FAIL`.
- Static source is E1; an unexecuted test file never earns E2.
- Runtime evidence must match the exact commit and artifact.
- Repository Stars, downloads, directory inclusion, and identity labels never change the score.
- A mother repository cannot lend unrelated tests, releases, or maintenance activity to a nested plugin.

## Pull request checklist

- [ ] The change protects a real supported DSH usage path.
- [ ] Tests include positive, negative, and adjacent-consumer coverage.
- [ ] Generated reports were refreshed only when score behavior changed.
- [ ] No credential-like value or private data was added.
- [ ] Documentation describes observable behavior and remaining evidence gaps.
