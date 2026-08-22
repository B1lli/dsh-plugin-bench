# DSH Plugin Quality Scorecard

**Target:** ccch1mneyyy/dsh-TUI

| Provenance | Value |
|---|---|
| Commit | 0dcc4bb99ddddffeefd70c875c1520339c696f59 |
| Artifact | . |
| Evaluated at | 2026-08-20T17:38:26.245Z |
| Artifact commit at | 2026-08-20T15:15:34+08:00 |
| Identity | SELF_CLAIMED |
| Classification | bundle |

## Result

- **Quality interval:** 58.5–84.5/100
- **Evidence coverage:** 74%
- **Grade:** 暂定/未排名
- **Adoption (not scored):** ★ 2315, 107 forks

| Dimension | Confirmed | Possible | UNPROVEN |
|---|---:|---:|---:|
| 功能价值与结果正确性 | 12 | 20 | 3 |
| 安装、激活、升级与卸载 | 9 | 12 | 3 |
| DSH 原生集成与可组合性 | 10.5 | 13 | 0 |
| 可靠性与状态完整性 | 0 | 12 | 12 |
| 权限、安全与隐私 | 13 | 15 | 0 |
| 性能与资源效率 | 0 | 8 | 8 |
| 用户体验与可运维性 | 8 | 10 | 0 |
| 测试、发布与维护质量 | 6 | 10 | 0 |

## Evidence gaps and failures

- **FAIL** `function.automated-tests` (5 points): 未发现自动化测试.
- **UNPROVEN** `performance.main-path` (4 points): 尚无主路径延迟、内存、网络或 token 增量.
- **UNPROVEN** `performance.startup-idle` (4 points): 尚无相对 baseline 的启动与空闲资源增量.
- **UNPROVEN** `reliability.state-restart` (4 points): 检测到状态能力，但尚未验证重启/部分失败后的完整性.
- **UNPROVEN** `function.negative-path` (3 points): 尚无受支持失败路径的真实运行证据.
- **UNPROVEN** `install.restart-remove` (3 points): 尚未验证重启激活与卸载清理.
- **UNPROVEN** `reliability.error-tests` (3 points): 静态测试形状不能证明错误或无效输入测试已执行.
- **UNPROVEN** `reliability.repeat-run` (3 points): 尚未验证重复运行的稳定性.
- **UNPROVEN** `reliability.timeout-cancel` (2 points): 静态测试形状不能证明取消或超时路径已执行.
- **PARTIAL** `engineering.verification` (4 points): tests=false, ci=true, scripts=none.
- **PARTIAL** `security.permission-scope` (4 points): 使用隔离 DSH_HOME，未观察到工作区写入；未做系统调用级审计. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-tui-086](../../evidence/raw/plugin-runtime-pilot.md#dsh-tui-086).
- **PARTIAL** `integration.lifecycle` (3 points): 静态发现长期资源与清理形状；未证明两者生命周期关联.
- **PARTIAL** `engineering.release` (2 points): artifact lockfile=true, artifact changelog=false.
- **PARTIAL** `engineering.support` (2 points): security policy=false, license=true.
- **PARTIAL** `integration.compose-hmr` (2 points): 可在 rc.8 启动，但运行时告警称该发布物仅验证到 rc.7，与源码验证说明存在漂移. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-tui-086](../../evidence/raw/plugin-runtime-pilot.md#dsh-tui-086).
- **PARTIAL** `ux.actionable-errors` (2 points): 错误是否能指导用户下一步.
- **PARTIAL** `ux.ui-layout` (2 points): 验证单一桌面 TTY；未覆盖不同终端尺寸和配色. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-tui-086](../../evidence/raw/plugin-runtime-pilot.md#dsh-tui-086).

## Complete evidence ledger

| Status | Check | Dimension | Weight | Level | Finding and evidence |
|---|---|---|---:|---|---|
| **PASS** | `function.promise` | 功能价值与结果正确性 | 4 | E1 | 核心用途与主路径是否具体可核查. Evidence: README.md. |
| **FAIL** | `function.automated-tests` | 功能价值与结果正确性 | 5 | E1 | 未发现自动化测试. |
| **PASS** | `function.core-path` | 功能价值与结果正确性 | 8 | E4 | 真实 TTY 启动并渲染可交互 dsh-TUI 0.8.6 主界面. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-tui-086](../../evidence/raw/plugin-runtime-pilot.md#dsh-tui-086). |
| **UNPROVEN** | `function.negative-path` | 功能价值与结果正确性 | 3 | E0 | 尚无受支持失败路径的真实运行证据. |
| **PASS** | `install.documentation` | 安装、激活、升级与卸载 | 3 | E1 | README 提供与 artifact 类型匹配的安装/启用说明. Evidence: README.md. |
| **PASS** | `install.manifest` | 安装、激活、升级与卸载 | 3 | E1 | dsh.bundle.patch 均可解析. Evidence: cordis.patch.yml. |
| **PASS** | `install.clean-profile` | 安装、激活、升级与卸载 | 3 | E3 | npm 包 0.8.6 从空 DSH_HOME 安装并解析完整 patch. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-tui-086](../../evidence/raw/plugin-runtime-pilot.md#dsh-tui-086). |
| **UNPROVEN** | `install.restart-remove` | 安装、激活、升级与卸载 | 3 | E0 | 尚未验证重启激活与卸载清理. |
| **PASS** | `integration.public-seam` | DSH 原生集成与可组合性 | 3 | E1 | 声明 24 个 DSH/Cordis 依赖. Evidence: @deepseek-ai/cordis@^4.0.1; @deepseek-ai/dsh-agent@^0.1.0-rc.7; @deepseek-ai/dsh-agent-instructions@^0.1.0-rc.7; @deepseek-ai/dsh-agent-presets@^0.1.0-rc.7; @deepseek-ai/dsh-atomic-write@^0.1.0-rc.7; @deepseek-ai/dsh-commands@^0.1.0-rc.7; @deepseek-ai/dsh-cordis-host-runner@^0.1.0-rc.7; @deepseek-ai/dsh-invariants@^0.1.0-rc.7; @deepseek-ai/dsh-llm@^0.1.0-rc.7; @deepseek-ai/dsh-persona@^0.1.0-rc.7; @deepseek-ai/dsh-session@^0.1.0-rc.7; @deepseek-ai/dsh-skill@^0.1.0-rc.7; @deepseek-ai/dsh-storage@^0.1.0-rc.7; @deepseek-ai/dsh-storage-domain@^0.1.0-rc.7; @deepseek-ai/dsh-storage-json@^0.1.0-rc.7; @deepseek-ai/dsh-system-prompt@^0.1.0-rc.7; @deepseek-ai/dsh-terminal@^0.1.0-rc.7; @deepseek-ai/dsh-terminal-bash@^0.1.0-rc.7; @deepseek-ai/dsh-tool-ask-user@^0.1.0-rc.7; @deepseek-ai/dsh-tool-bash-persistent@^0.1.0-rc.7; @deepseek-ai/dsh-tool-cordis@^0.1.0-rc.7; @deepseek-ai/dsh-user-approval@^0.1.0-rc.7; @deepseek-ai/dsh-user-questions@^0.1.0-rc.7; @deepseek-ai/dsh-workspace@^0.1.0-rc.7. |
| **PASS** | `integration.version-range` | DSH 原生集成与可组合性 | 3 | E1 | 声明外部 DSH/Cordis 版本范围. Evidence: @deepseek-ai/cordis@^4.0.1; @deepseek-ai/dsh-agent@^0.1.0-rc.7; @deepseek-ai/dsh-agent-instructions@^0.1.0-rc.7; @deepseek-ai/dsh-agent-presets@^0.1.0-rc.7; @deepseek-ai/dsh-atomic-write@^0.1.0-rc.7; @deepseek-ai/dsh-commands@^0.1.0-rc.7; @deepseek-ai/dsh-cordis-host-runner@^0.1.0-rc.7; @deepseek-ai/dsh-invariants@^0.1.0-rc.7; @deepseek-ai/dsh-llm@^0.1.0-rc.7; @deepseek-ai/dsh-persona@^0.1.0-rc.7; @deepseek-ai/dsh-session@^0.1.0-rc.7; @deepseek-ai/dsh-skill@^0.1.0-rc.7; @deepseek-ai/dsh-storage@^0.1.0-rc.7; @deepseek-ai/dsh-storage-domain@^0.1.0-rc.7; @deepseek-ai/dsh-storage-json@^0.1.0-rc.7; @deepseek-ai/dsh-system-prompt@^0.1.0-rc.7; @deepseek-ai/dsh-terminal@^0.1.0-rc.7; @deepseek-ai/dsh-terminal-bash@^0.1.0-rc.7; @deepseek-ai/dsh-tool-ask-user@^0.1.0-rc.7; @deepseek-ai/dsh-tool-bash-persistent@^0.1.0-rc.7; @deepseek-ai/dsh-tool-cordis@^0.1.0-rc.7; @deepseek-ai/dsh-user-approval@^0.1.0-rc.7; @deepseek-ai/dsh-user-questions@^0.1.0-rc.7; @deepseek-ai/dsh-workspace@^0.1.0-rc.7. |
| **PARTIAL** | `integration.lifecycle` | DSH 原生集成与可组合性 | 3 | E1 | 静态发现长期资源与清理形状；未证明两者生命周期关联. |
| **PASS** | `integration.config-validation` | DSH 原生集成与可组合性 | 2 | E1 | 配置是否在最早可判断处校验. |
| **PARTIAL** | `integration.compose-hmr` | DSH 原生集成与可组合性 | 2 | E3 | 可在 rc.8 启动，但运行时告警称该发布物仅验证到 rc.7，与源码验证说明存在漂移. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-tui-086](../../evidence/raw/plugin-runtime-pilot.md#dsh-tui-086). |
| **UNPROVEN** | `reliability.error-tests` | 可靠性与状态完整性 | 3 | E1 | 静态测试形状不能证明错误或无效输入测试已执行. |
| **UNPROVEN** | `reliability.timeout-cancel` | 可靠性与状态完整性 | 2 | E1 | 静态测试形状不能证明取消或超时路径已执行. |
| **UNPROVEN** | `reliability.repeat-run` | 可靠性与状态完整性 | 3 | E0 | 尚未验证重复运行的稳定性. |
| **UNPROVEN** | `reliability.state-restart` | 可靠性与状态完整性 | 4 | E0 | 检测到状态能力，但尚未验证重启/部分失败后的完整性. |
| **PASS** | `security.license` | 权限、安全与隐私 | 2 | E1 | 发现许可证声明. |
| **PASS** | `security.embedded-secret` | 权限、安全与隐私 | 3 | E1 | 未在运行源码中发现常见长效凭证字面量. |
| **PASS** | `security.install-scripts` | 权限、安全与隐私 | 3 | E1 | 安装期脚本：prepare. Evidence: prepare: npm run compile. |
| **PASS** | `security.network-credentials` | 权限、安全与隐私 | 3 | E1 | 网络、凭证与遥测行为是否披露. |
| **PARTIAL** | `security.permission-scope` | 权限、安全与隐私 | 4 | E4 | 使用隔离 DSH_HOME，未观察到工作区写入；未做系统调用级审计. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-tui-086](../../evidence/raw/plugin-runtime-pilot.md#dsh-tui-086). |
| **N/A** | `security.major-undisclosed` | 权限、安全与隐私 | 0 | E0 | 未提交重大未披露越界行为 gate 证据. |
| **UNPROVEN** | `performance.startup-idle` | 性能与资源效率 | 4 | E0 | 尚无相对 baseline 的启动与空闲资源增量. |
| **UNPROVEN** | `performance.main-path` | 性能与资源效率 | 4 | E0 | 尚无主路径延迟、内存、网络或 token 增量. |
| **PASS** | `ux.readme-config` | 用户体验与可运维性 | 3 | E1 | README 是否覆盖安装、配置和使用. |
| **PARTIAL** | `ux.actionable-errors` | 用户体验与可运维性 | 2 | E1 | 错误是否能指导用户下一步. |
| **PASS** | `ux.visible-result` | 用户体验与可运维性 | 3 | E4 | 主界面、模型状态、输入区和兼容性告警均可见. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-tui-086](../../evidence/raw/plugin-runtime-pilot.md#dsh-tui-086). |
| **PARTIAL** | `ux.ui-layout` | 用户体验与可运维性 | 2 | E4 | 验证单一桌面 TTY；未覆盖不同终端尺寸和配色. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-tui-086](../../evidence/raw/plugin-runtime-pilot.md#dsh-tui-086). |
| **PARTIAL** | `engineering.verification` | 测试、发布与维护质量 | 4 | E1 | tests=false, ci=true, scripts=none. |
| **PARTIAL** | `engineering.release` | 测试、发布与维护质量 | 2 | E1 | artifact lockfile=true, artifact changelog=false. |
| **PARTIAL** | `engineering.support` | 测试、发布与维护质量 | 2 | E1 | security policy=false, license=true. |
| **PASS** | `engineering.maintenance` | 测试、发布与维护质量 | 2 | E1 | 固定 commit 距固定评估时点 0 天. |

> A quality interval is not a popularity ranking. UNPROVEN increases only the upper bound; Stars and identity never change the quality score.

_Generated by dsh-plugin-bench._
