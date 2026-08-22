# Published-plugin runtime pilot — normalized evidence

These are the minimum command/result facts retained from the isolated runtime pilot. Temporary paths, ports and ANSI bytes are omitted. Package provenance is resolved to the repository commit used by the benchmark; no credential value is recorded.

## dsh-TUI 0.8.6

- Target: `ccch1mneyyy/dsh-TUI`
- Commit: `0dcc4bb99ddddffeefd70c875c1520339c696f59`
- Package: `@deepseek-harness-tui/dsh-tui@0.8.6`
- Provenance: `npm view @deepseek-harness-tui/dsh-tui@0.8.6 gitHead` returned the target commit.
- Environment: DSH `0.1.0-rc.8`, Node `22.22.0`, macOS, isolated `DSH_HOME`.

```text
$ DSH_HOME=<isolated> dsh plugin --profile dsh-tui add @deepseek-harness-tui/dsh-tui@0.8.6
exit=0

$ DSH_HOME=<isolated> dsh --profile dsh-tui --dump-config
plugin patch resolved
exit=0

$ DSH_HOME=<isolated> dsh --profile dsh-tui
visible: dsh-TUI 0.8.6 header, model status, input area
warning: package validated through Harness rc.7 while runtime is rc.8
```

One desktop TTY viewport was observed. The isolated checkout remained unchanged; system-call-level file/network tracing was not performed.

## plugin-registry 0.1.0

- Target: `vlln/plugin-registry`
- Artifact: `packages/plugin/console`
- Commit: `303b728b9fa780cdba45d2c7ac6df580eb84c540`
- Package: `@vlln/plugin-console@0.1.0`
- Provenance: `npm view @vlln/plugin-console@0.1.0 gitHead` returned the target commit.
- Environment: DSH `0.1.0-rc.8`, Node `22.22.0`, macOS, isolated `DSH_HOME`.

```text
$ DSH_HOME=<isolated> dsh plugin --profile web add @vlln/plugin-console@0.1.0
exit=0

$ DSH_HOME=<isolated> dsh --profile web --dump-config
plugin patch resolved
exit=0

$ DSH_HOME=<isolated> dsh --profile web --host 127.0.0.1 --port <temporary>
registered tools: plugin_search, plugin_install, plugin_uninstall, plugin_status

$ curl -fsS http://127.0.0.1:<temporary>/api/plugin-console/installed
HTTP 200; JSON installed-plugin list returned
```

The observed status endpoint was read-only. The write scope of install/uninstall tools was not traced at system-call level, and browser-panel interaction was not completed.

## dsh-market 0.2.1

- Target: `2BingLing/dsh-market`
- Artifact: `plugin/ui`
- Commit: `f840fd4010904cb8cea2ff4000b10c74e84dd96c`
- Package: `@dsh-market/plugin@0.2.1`
- Provenance: `npm view @dsh-market/plugin@0.2.1 gitHead` returned the target commit.
- Environment: DSH `0.1.0-rc.8`, Node `22.22.0`, macOS, isolated `DSH_HOME`.

```text
$ DSH_HOME=<isolated> dsh plugin --profile web add @dsh-market/plugin@0.2.1
exit=0

$ DSH_HOME=<isolated> dsh --profile web --dump-config
plugin patch resolved
exit=0

$ DSH_HOME=<isolated> dsh --profile web --host 127.0.0.1 --port <temporary>
$ curl -fsS http://127.0.0.1:<temporary>/
HTTP 200
```

The market UI user path and artifact-owned functional tests were not completed; those checks remain `UNPROVEN` or `FAIL` rather than inheriting collector tests from the mother repository.

## dsh-at-file v0.6.7

- Target: `omdsh-dev/dsh-at-file`
- Commit: `c57849b27e378cf6b41d082b17c8a8750cee370f`
- Release: README-pinned `v0.6.7` tarball.
- Provenance: GitHub tag `v0.6.7` resolves to the target commit.
- Environment: DSH `0.1.0-rc.8`, Node `22.22.0`, macOS, isolated `DSH_HOME`.

```text
$ DSH_HOME=<isolated> dsh plugin --profile web add <README v0.6.7 tarball URL>
exit=0

$ DSH_HOME=<isolated> dsh --profile web --dump-config
dsh-at-file patch resolved
exit=0

$ DSH_HOME=<isolated> dsh --profile web --host 127.0.0.1 --port <temporary>
$ curl -fsS http://127.0.0.1:<temporary>/
HTTP 200
```

No `@file` browser interaction was completed, so core-path and visible-result checks remain `UNPROVEN`.
