# DSH Plugin Quality Scorecard

**Target:** deepseek-ai/deepseek-harness

| Provenance | Value |
|---|---|
| Commit | 141eb6fef83422698aef7a981029e843e8161534 |
| Artifact | packages/plan/plan-mode |
| Evaluated at | 2026-08-20T17:38:26.245Z |
| Artifact commit at | 2026-08-19T15:00:28Z |
| Identity | OFFICIAL_BUILT_IN |
| Classification | native-plugin |

## Result

- **Quality interval:** 41.8–89/100
- **Evidence coverage:** 52.7%
- **Grade:** 暂定/未排名
- **Adoption (not scored):** ★ 185006, 20454 forks

| Dimension | Confirmed | Possible | UNPROVEN |
|---|---:|---:|---:|
| 功能价值与结果正确性 | 7 | 20 | 11 |
| 安装、激活、升级与卸载 | 3 | 9 | 6 |
| DSH 原生集成与可组合性 | 6.5 | 10 | 2 |
| 可靠性与状态完整性 | 2.5 | 12 | 7 |
| 权限、安全与隐私 | 8 | 12 | 4 |
| 性能与资源效率 | 0 | 8 | 8 |
| 用户体验与可运维性 | 4 | 10 | 5 |
| 测试、发布与维护质量 | 7 | 10 | 0 |

## Evidence gaps and failures

- **FAIL** `engineering.release` (2 points): artifact lockfile=false, artifact changelog=false.
- **UNPROVEN** `function.core-path` (8 points): 尚无真实用户主路径和最终结果证据.
- **UNPROVEN** `performance.main-path` (4 points): 尚无主路径延迟、内存、网络或 token 增量.
- **UNPROVEN** `performance.startup-idle` (4 points): 尚无相对 baseline 的启动与空闲资源增量.
- **UNPROVEN** `reliability.state-restart` (4 points): 检测到状态能力，但尚未验证重启/部分失败后的完整性.
- **UNPROVEN** `security.permission-scope` (4 points): 尚未以真实运行观察权限、网络和写入范围.
- **UNPROVEN** `function.negative-path` (3 points): 尚无受支持失败路径的真实运行证据.
- **UNPROVEN** `install.clean-profile` (3 points): 尚未在隔离 DSH_HOME 执行干净安装.
- **UNPROVEN** `install.restart-remove` (3 points): 尚未验证重启激活与卸载清理.
- **UNPROVEN** `reliability.repeat-run` (3 points): 尚未验证重复运行的稳定性.
- **UNPROVEN** `ux.visible-result` (3 points): 尚无用户可见兑现证据.
- **UNPROVEN** `integration.compose-hmr` (2 points): 尚未验证与 baseline 共存、HMR 或卸载生命周期.
- **UNPROVEN** `ux.ui-layout` (2 points): 检测到 UI 能力，但尚未验证桌面/移动与关键交互.
- **PARTIAL** `function.promise` (4 points): 核心用途与主路径是否具体可核查. Evidence: README.md.
- **PARTIAL** `integration.version-range` (3 points): 未确认可发布物的兼容版本范围.
- **PARTIAL** `reliability.error-tests` (3 points): 静态测试形状不能证明错误或无效输入测试已执行.
- **PARTIAL** `engineering.support` (2 points): security policy=false, license=true.
- **PARTIAL** `reliability.timeout-cancel` (2 points): 静态测试形状不能证明取消或超时路径已执行.
- **PARTIAL** `ux.actionable-errors` (2 points): 错误是否能指导用户下一步.

## Complete evidence ledger

| Status | Check | Dimension | Weight | Level | Finding and evidence |
|---|---|---|---:|---|---|
| **PARTIAL** | `function.promise` | 功能价值与结果正确性 | 4 | E1 | 核心用途与主路径是否具体可核查. Evidence: README.md. |
| **PASS** | `function.automated-tests` | 功能价值与结果正确性 | 5 | E2 | 官方 plan-mode 聚焦测试 4 个文件、83 个测试全部通过. Evidence: corepack pnpm exec vitest run packages/plan/plan-mode/tests. |
| **UNPROVEN** | `function.core-path` | 功能价值与结果正确性 | 8 | E0 | 尚无真实用户主路径和最终结果证据. |
| **UNPROVEN** | `function.negative-path` | 功能价值与结果正确性 | 3 | E0 | 尚无受支持失败路径的真实运行证据. |
| **PASS** | `install.documentation` | 安装、激活、升级与卸载 | 3 | E1 | README 提供与 artifact 类型匹配的安装/启用说明. Evidence: README.md. |
| **N/A** | `install.manifest` | 安装、激活、升级与卸载 | 3 | E1 | 该类型不使用 bundle patch. |
| **UNPROVEN** | `install.clean-profile` | 安装、激活、升级与卸载 | 3 | E0 | 尚未在隔离 DSH_HOME 执行干净安装. |
| **UNPROVEN** | `install.restart-remove` | 安装、激活、升级与卸载 | 3 | E0 | 尚未验证重启激活与卸载清理. |
| **PASS** | `integration.public-seam` | DSH 原生集成与可组合性 | 3 | E1 | 声明 10 个 DSH/Cordis 依赖. Evidence: @deepseek-ai/dsh-agent@workspace:^; @deepseek-ai/dsh-commands@workspace:^; @deepseek-ai/dsh-invariants@workspace:^; @deepseek-ai/dsh-llm@workspace:^; @deepseek-ai/dsh-session@workspace:^; @deepseek-ai/dsh-session-projection@workspace:^; @deepseek-ai/dsh-system-prompt@workspace:^; @deepseek-ai/dsh-tools@workspace:^; @deepseek-ai/dsh-user-questions@workspace:^; @deepseek-ai/cordis@workspace:^. |
| **PARTIAL** | `integration.version-range` | DSH 原生集成与可组合性 | 3 | E1 | 未确认可发布物的兼容版本范围. |
| **N/A** | `integration.lifecycle` | DSH 原生集成与可组合性 | 3 | E1 | 未发现需额外管理的 timer/watcher/server 资源. |
| **PASS** | `integration.config-validation` | DSH 原生集成与可组合性 | 2 | E1 | 配置是否在最早可判断处校验. |
| **UNPROVEN** | `integration.compose-hmr` | DSH 原生集成与可组合性 | 2 | E0 | 尚未验证与 baseline 共存、HMR 或卸载生命周期. |
| **PARTIAL** | `reliability.error-tests` | 可靠性与状态完整性 | 3 | E1 | 静态测试形状不能证明错误或无效输入测试已执行. |
| **PARTIAL** | `reliability.timeout-cancel` | 可靠性与状态完整性 | 2 | E1 | 静态测试形状不能证明取消或超时路径已执行. |
| **UNPROVEN** | `reliability.repeat-run` | 可靠性与状态完整性 | 3 | E0 | 尚未验证重复运行的稳定性. |
| **UNPROVEN** | `reliability.state-restart` | 可靠性与状态完整性 | 4 | E0 | 检测到状态能力，但尚未验证重启/部分失败后的完整性. |
| **PASS** | `security.license` | 权限、安全与隐私 | 2 | E1 | 发现许可证声明. |
| **PASS** | `security.embedded-secret` | 权限、安全与隐私 | 3 | E1 | 未在运行源码中发现常见长效凭证字面量. |
| **PASS** | `security.install-scripts` | 权限、安全与隐私 | 3 | E1 | 无安装期脚本. |
| **N/A** | `security.network-credentials` | 权限、安全与隐私 | 3 | E1 | 网络、凭证与遥测行为是否披露. |
| **UNPROVEN** | `security.permission-scope` | 权限、安全与隐私 | 4 | E0 | 尚未以真实运行观察权限、网络和写入范围. |
| **N/A** | `security.major-undisclosed` | 权限、安全与隐私 | 0 | E0 | 未提交重大未披露越界行为 gate 证据. |
| **UNPROVEN** | `performance.startup-idle` | 性能与资源效率 | 4 | E0 | 尚无相对 baseline 的启动与空闲资源增量. |
| **UNPROVEN** | `performance.main-path` | 性能与资源效率 | 4 | E0 | 尚无主路径延迟、内存、网络或 token 增量. |
| **PASS** | `ux.readme-config` | 用户体验与可运维性 | 3 | E1 | README 是否覆盖安装、配置和使用. |
| **PARTIAL** | `ux.actionable-errors` | 用户体验与可运维性 | 2 | E1 | 错误是否能指导用户下一步. |
| **UNPROVEN** | `ux.visible-result` | 用户体验与可运维性 | 3 | E0 | 尚无用户可见兑现证据. |
| **UNPROVEN** | `ux.ui-layout` | 用户体验与可运维性 | 2 | E0 | 检测到 UI 能力，但尚未验证桌面/移动与关键交互. |
| **PASS** | `engineering.verification` | 测试、发布与维护质量 | 4 | E2 | 官方 plan-mode 聚焦测试 4 个文件、83 个测试全部通过. Evidence: corepack pnpm exec vitest run packages/plan/plan-mode/tests. |
| **FAIL** | `engineering.release` | 测试、发布与维护质量 | 2 | E1 | artifact lockfile=false, artifact changelog=false. |
| **PARTIAL** | `engineering.support` | 测试、发布与维护质量 | 2 | E1 | security policy=false, license=true. |
| **PASS** | `engineering.maintenance` | 测试、发布与维护质量 | 2 | E1 | 固定 commit 距固定评估时点 1 天. |

> A quality interval is not a popularity ranking. UNPROVEN increases only the upper bound; Stars and identity never change the quality score.

_Generated by dsh-plugin-bench._
