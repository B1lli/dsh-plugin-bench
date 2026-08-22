# DSH Plugin Quality Scorecard

**Target:** omdsh-dev/dsh-at-file

| Provenance | Value |
|---|---|
| Commit | c57849b27e378cf6b41d082b17c8a8750cee370f |
| Artifact | . |
| Evaluated at | 2026-08-20T17:38:26.245Z |
| Artifact commit at | 2026-08-20T23:34:20+08:00 |
| Identity | COMMUNITY_DISCOVERABLE |
| Classification | bundle |

## Result

- **Quality interval:** 53.1–92.3/100
- **Evidence coverage:** 60.8%
- **Grade:** 暂定/未排名
- **Adoption (not scored):** ★ 454, 18 forks

| Dimension | Confirmed | Possible | UNPROVEN |
|---|---:|---:|---:|
| 功能价值与结果正确性 | 9 | 20 | 11 |
| 安装、激活、升级与卸载 | 9 | 12 | 3 |
| DSH 原生集成与可组合性 | 10 | 10 | 0 |
| 可靠性与状态完整性 | 2.5 | 12 | 7 |
| 权限、安全与隐私 | 11 | 15 | 4 |
| 性能与资源效率 | 0 | 8 | 8 |
| 用户体验与可运维性 | 4 | 10 | 5 |
| 测试、发布与维护质量 | 6 | 10 | 0 |

## Evidence gaps and failures

- **UNPROVEN** `function.core-path` (8 points): 尚无真实用户主路径和最终结果证据.
- **UNPROVEN** `performance.main-path` (4 points): 尚无主路径延迟、内存、网络或 token 增量.
- **UNPROVEN** `performance.startup-idle` (4 points): 尚无相对 baseline 的启动与空闲资源增量.
- **UNPROVEN** `reliability.state-restart` (4 points): 检测到状态能力，但尚未验证重启/部分失败后的完整性.
- **UNPROVEN** `security.permission-scope` (4 points): 尚未以真实运行观察权限、网络和写入范围.
- **UNPROVEN** `function.negative-path` (3 points): 尚无受支持失败路径的真实运行证据.
- **UNPROVEN** `install.restart-remove` (3 points): 尚未验证重启激活与卸载清理.
- **UNPROVEN** `reliability.repeat-run` (3 points): 尚未验证重复运行的稳定性.
- **UNPROVEN** `ux.visible-result` (3 points): 尚无用户可见兑现证据.
- **UNPROVEN** `ux.ui-layout` (2 points): 检测到 UI 能力，但尚未验证桌面/移动与关键交互.
- **PARTIAL** `engineering.verification` (4 points): 按支持的 sibling 源码布局完成 typecheck、164 个测试与 build；冻结安装因 workspace 配置与 lockfile 不一致失败. Evidence: pnpm install --frozen-lockfile: config mismatch; supported sibling layout pnpm run check: 164 tests plus typecheck/build passed.
- **PARTIAL** `reliability.error-tests` (3 points): 静态测试形状不能证明错误或无效输入测试已执行.
- **PARTIAL** `engineering.release` (2 points): artifact lockfile=true, artifact changelog=false.
- **PARTIAL** `engineering.support` (2 points): security policy=false, license=true.
- **PARTIAL** `reliability.timeout-cancel` (2 points): 静态测试形状不能证明取消或超时路径已执行.
- **PARTIAL** `ux.actionable-errors` (2 points): 错误是否能指导用户下一步.

## Complete evidence ledger

| Status | Check | Dimension | Weight | Level | Finding and evidence |
|---|---|---|---:|---|---|
| **PASS** | `function.promise` | 功能价值与结果正确性 | 4 | E1 | 核心用途与主路径是否具体可核查. Evidence: README.md. |
| **PASS** | `function.automated-tests` | 功能价值与结果正确性 | 5 | E2 | 按项目支持的 sibling 源码布局执行 164 个测试，全部通过. Evidence: supported sibling layout pnpm run check: 164 tests passed. |
| **UNPROVEN** | `function.core-path` | 功能价值与结果正确性 | 8 | E0 | 尚无真实用户主路径和最终结果证据. |
| **UNPROVEN** | `function.negative-path` | 功能价值与结果正确性 | 3 | E0 | 尚无受支持失败路径的真实运行证据. |
| **PASS** | `install.documentation` | 安装、激活、升级与卸载 | 3 | E1 | README 提供与 artifact 类型匹配的安装/启用说明. Evidence: README.md. |
| **PASS** | `install.manifest` | 安装、激活、升级与卸载 | 3 | E1 | dsh.bundle.patch 均可解析. Evidence: cordis.patch.yml. |
| **PASS** | `install.clean-profile` | 安装、激活、升级与卸载 | 3 | E3 | README 固定 tarball v0.6.7 从空 DSH_HOME 安装并启动 Web profile. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-at-file-v067](../../evidence/raw/plugin-runtime-pilot.md#dsh-at-file-v067). |
| **UNPROVEN** | `install.restart-remove` | 安装、激活、升级与卸载 | 3 | E0 | 尚未验证重启激活与卸载清理. |
| **PASS** | `integration.public-seam` | DSH 原生集成与可组合性 | 3 | E1 | 声明 14 个 DSH/Cordis 依赖. Evidence: @deepseek-ai/cordis@^4.0.1-rc.1; @deepseek-ai/dsh-agent@*; @deepseek-ai/dsh-typert-protocol@*; @deepseek-ai/dsh-client-runtime@*; @deepseek-ai/dsh-api-remotes@*; @deepseek-ai/dsh-client-ui-input-trigger@*; @deepseek-ai/dsh-client-ui-slots@*; @deepseek-ai/dsh-client-ui-conversation@*; @deepseek-ai/dsh-client-locale@*; @deepseek-ai/dsh-client-connection@*; @deepseek-ai/dsh-typert-registry@*; @deepseek-ai/dsh-settings@*; @deepseek-ai/dsh-client-ui-settings@*; @deepseek-ai/dsh-llm@*. |
| **PASS** | `integration.version-range` | DSH 原生集成与可组合性 | 3 | E1 | 声明外部 DSH/Cordis 版本范围. Evidence: @deepseek-ai/cordis@^4.0.1-rc.1; @deepseek-ai/dsh-agent@*; @deepseek-ai/dsh-typert-protocol@*; @deepseek-ai/dsh-client-runtime@*; @deepseek-ai/dsh-api-remotes@*; @deepseek-ai/dsh-client-ui-input-trigger@*; @deepseek-ai/dsh-client-ui-slots@*; @deepseek-ai/dsh-client-ui-conversation@*; @deepseek-ai/dsh-client-locale@*; @deepseek-ai/dsh-client-connection@*; @deepseek-ai/dsh-typert-registry@*; @deepseek-ai/dsh-settings@*; @deepseek-ai/dsh-client-ui-settings@*; @deepseek-ai/dsh-llm@*. |
| **N/A** | `integration.lifecycle` | DSH 原生集成与可组合性 | 3 | E1 | 未发现需额外管理的 timer/watcher/server 资源. |
| **PASS** | `integration.config-validation` | DSH 原生集成与可组合性 | 2 | E1 | 配置是否在最早可判断处校验. |
| **PASS** | `integration.compose-hmr` | DSH 原生集成与可组合性 | 2 | E3 | 配置解析并与官方 Web baseline 共存启动. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-at-file-v067](../../evidence/raw/plugin-runtime-pilot.md#dsh-at-file-v067). |
| **PARTIAL** | `reliability.error-tests` | 可靠性与状态完整性 | 3 | E1 | 静态测试形状不能证明错误或无效输入测试已执行. |
| **PARTIAL** | `reliability.timeout-cancel` | 可靠性与状态完整性 | 2 | E1 | 静态测试形状不能证明取消或超时路径已执行. |
| **UNPROVEN** | `reliability.repeat-run` | 可靠性与状态完整性 | 3 | E0 | 尚未验证重复运行的稳定性. |
| **UNPROVEN** | `reliability.state-restart` | 可靠性与状态完整性 | 4 | E0 | 检测到状态能力，但尚未验证重启/部分失败后的完整性. |
| **PASS** | `security.license` | 权限、安全与隐私 | 2 | E1 | 发现许可证声明. |
| **PASS** | `security.embedded-secret` | 权限、安全与隐私 | 3 | E1 | 未在运行源码中发现常见长效凭证字面量. |
| **PASS** | `security.install-scripts` | 权限、安全与隐私 | 3 | E1 | 无安装期脚本. |
| **PASS** | `security.network-credentials` | 权限、安全与隐私 | 3 | E1 | 网络、凭证与遥测行为是否披露. |
| **UNPROVEN** | `security.permission-scope` | 权限、安全与隐私 | 4 | E0 | 尚未以真实运行观察权限、网络和写入范围. |
| **N/A** | `security.major-undisclosed` | 权限、安全与隐私 | 0 | E0 | 未提交重大未披露越界行为 gate 证据. |
| **UNPROVEN** | `performance.startup-idle` | 性能与资源效率 | 4 | E0 | 尚无相对 baseline 的启动与空闲资源增量. |
| **UNPROVEN** | `performance.main-path` | 性能与资源效率 | 4 | E0 | 尚无主路径延迟、内存、网络或 token 增量. |
| **PASS** | `ux.readme-config` | 用户体验与可运维性 | 3 | E1 | README 是否覆盖安装、配置和使用. |
| **PARTIAL** | `ux.actionable-errors` | 用户体验与可运维性 | 2 | E1 | 错误是否能指导用户下一步. |
| **UNPROVEN** | `ux.visible-result` | 用户体验与可运维性 | 3 | E0 | 尚无用户可见兑现证据. |
| **UNPROVEN** | `ux.ui-layout` | 用户体验与可运维性 | 2 | E0 | 检测到 UI 能力，但尚未验证桌面/移动与关键交互. |
| **PARTIAL** | `engineering.verification` | 测试、发布与维护质量 | 4 | E2 | 按支持的 sibling 源码布局完成 typecheck、164 个测试与 build；冻结安装因 workspace 配置与 lockfile 不一致失败. Evidence: pnpm install --frozen-lockfile: config mismatch; supported sibling layout pnpm run check: 164 tests plus typecheck/build passed. |
| **PARTIAL** | `engineering.release` | 测试、发布与维护质量 | 2 | E1 | artifact lockfile=true, artifact changelog=false. |
| **PARTIAL** | `engineering.support` | 测试、发布与维护质量 | 2 | E1 | security policy=false, license=true. |
| **PASS** | `engineering.maintenance` | 测试、发布与维护质量 | 2 | E1 | 固定 commit 距固定评估时点 0 天. |

> A quality interval is not a popularity ranking. UNPROVEN increases only the upper bound; Stars and identity never change the quality score.

_Generated by dsh-plugin-bench._
