# DSH Plugin Quality Scorecard

**Target:** 2BingLing/dsh-market

| Provenance | Value |
|---|---|
| Commit | f840fd4010904cb8cea2ff4000b10c74e84dd96c |
| Artifact | plugin/ui |
| Evaluated at | 2026-08-20T17:38:26.245Z |
| Artifact commit at | 2026-08-16T05:29:19Z |
| Identity | COMMUNITY_DISCOVERABLE |
| Classification | bundle |

## Result

- **Quality interval:** 30–77/100
- **Evidence coverage:** 53%
- **Grade:** 暂定/未排名
- **Adoption (not scored):** ★ 55, 1 forks

| Dimension | Confirmed | Possible | UNPROVEN |
|---|---:|---:|---:|
| 功能价值与结果正确性 | 0 | 20 | 15 |
| 安装、激活、升级与卸载 | 6 | 12 | 3 |
| DSH 原生集成与可组合性 | 8.5 | 13 | 0 |
| 可靠性与状态完整性 | 0 | 12 | 12 |
| 权限、安全与隐私 | 9.5 | 15 | 4 |
| 性能与资源效率 | 0 | 8 | 8 |
| 用户体验与可运维性 | 1 | 10 | 5 |
| 测试、发布与维护质量 | 5 | 10 | 0 |

## Evidence gaps and failures

- **FAIL** `function.automated-tests` (5 points): 未发现自动化测试.
- **FAIL** `install.documentation` (3 points): 未发现与 artifact 类型匹配的安装/启用说明.
- **FAIL** `ux.readme-config` (3 points): README 是否覆盖安装、配置和使用.
- **FAIL** `engineering.release` (2 points): artifact lockfile=false, artifact changelog=false.
- **UNPROVEN** `function.core-path` (8 points): 尚无真实用户主路径和最终结果证据.
- **UNPROVEN** `function.promise` (4 points): 核心用途与主路径是否具体可核查.
- **UNPROVEN** `performance.main-path` (4 points): 尚无主路径延迟、内存、网络或 token 增量.
- **UNPROVEN** `performance.startup-idle` (4 points): 尚无相对 baseline 的启动与空闲资源增量.
- **UNPROVEN** `reliability.state-restart` (4 points): 检测到状态能力，但尚未验证重启/部分失败后的完整性.
- **UNPROVEN** `security.permission-scope` (4 points): 尚未以真实运行观察权限、网络和写入范围.
- **UNPROVEN** `function.negative-path` (3 points): 尚无受支持失败路径的真实运行证据.
- **UNPROVEN** `install.restart-remove` (3 points): 尚未验证重启激活与卸载清理.
- **UNPROVEN** `reliability.error-tests` (3 points): 静态测试形状不能证明错误或无效输入测试已执行.
- **UNPROVEN** `reliability.repeat-run` (3 points): 尚未验证重复运行的稳定性.
- **UNPROVEN** `ux.visible-result` (3 points): 尚无用户可见兑现证据.
- **UNPROVEN** `reliability.timeout-cancel` (2 points): 静态测试形状不能证明取消或超时路径已执行.
- **UNPROVEN** `ux.ui-layout` (2 points): 检测到 UI 能力，但尚未验证桌面/移动与关键交互.
- **PARTIAL** `engineering.verification` (4 points): tests=false, ci=false, scripts=test,typecheck.
- **PARTIAL** `integration.lifecycle` (3 points): 静态发现长期资源与清理形状；未证明两者生命周期关联.
- **PARTIAL** `integration.public-seam` (3 points): 未从包依赖确认官方扩展接口.
- **PARTIAL** `integration.version-range` (3 points): 未确认可发布物的兼容版本范围.
- **PARTIAL** `security.network-credentials` (3 points): 网络、凭证与遥测行为是否披露.
- **PARTIAL** `engineering.support` (2 points): security policy=false, license=true.
- **PARTIAL** `ux.actionable-errors` (2 points): 错误是否能指导用户下一步.

## Complete evidence ledger

| Status | Check | Dimension | Weight | Level | Finding and evidence |
|---|---|---|---:|---|---|
| **UNPROVEN** | `function.promise` | 功能价值与结果正确性 | 4 | E1 | 核心用途与主路径是否具体可核查. |
| **FAIL** | `function.automated-tests` | 功能价值与结果正确性 | 5 | E1 | 未发现自动化测试. |
| **UNPROVEN** | `function.core-path` | 功能价值与结果正确性 | 8 | E0 | 尚无真实用户主路径和最终结果证据. |
| **UNPROVEN** | `function.negative-path` | 功能价值与结果正确性 | 3 | E0 | 尚无受支持失败路径的真实运行证据. |
| **FAIL** | `install.documentation` | 安装、激活、升级与卸载 | 3 | E1 | 未发现与 artifact 类型匹配的安装/启用说明. |
| **PASS** | `install.manifest` | 安装、激活、升级与卸载 | 3 | E1 | dsh.bundle.patch 均可解析. Evidence: cordis.patch.yml. |
| **PASS** | `install.clean-profile` | 安装、激活、升级与卸载 | 3 | E3 | @dsh-market/plugin 从空 DSH_HOME 安装、解析并启动 Web profile. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-market-021](../../evidence/raw/plugin-runtime-pilot.md#dsh-market-021). |
| **UNPROVEN** | `install.restart-remove` | 安装、激活、升级与卸载 | 3 | E0 | 尚未验证重启激活与卸载清理. |
| **PARTIAL** | `integration.public-seam` | DSH 原生集成与可组合性 | 3 | E1 | 未从包依赖确认官方扩展接口. |
| **PARTIAL** | `integration.version-range` | DSH 原生集成与可组合性 | 3 | E1 | 未确认可发布物的兼容版本范围. |
| **PARTIAL** | `integration.lifecycle` | DSH 原生集成与可组合性 | 3 | E1 | 静态发现长期资源与清理形状；未证明两者生命周期关联. |
| **PASS** | `integration.config-validation` | DSH 原生集成与可组合性 | 2 | E1 | 配置是否在最早可判断处校验. |
| **PASS** | `integration.compose-hmr` | DSH 原生集成与可组合性 | 2 | E3 | 与官方 Web baseline 共存启动. Evidence: [evidence/raw/plugin-runtime-pilot.md#dsh-market-021](../../evidence/raw/plugin-runtime-pilot.md#dsh-market-021). |
| **UNPROVEN** | `reliability.error-tests` | 可靠性与状态完整性 | 3 | E1 | 静态测试形状不能证明错误或无效输入测试已执行. |
| **UNPROVEN** | `reliability.timeout-cancel` | 可靠性与状态完整性 | 2 | E1 | 静态测试形状不能证明取消或超时路径已执行. |
| **UNPROVEN** | `reliability.repeat-run` | 可靠性与状态完整性 | 3 | E0 | 尚未验证重复运行的稳定性. |
| **UNPROVEN** | `reliability.state-restart` | 可靠性与状态完整性 | 4 | E0 | 检测到状态能力，但尚未验证重启/部分失败后的完整性. |
| **PASS** | `security.license` | 权限、安全与隐私 | 2 | E1 | 发现许可证声明. |
| **PASS** | `security.embedded-secret` | 权限、安全与隐私 | 3 | E1 | 未在运行源码中发现常见长效凭证字面量. |
| **PASS** | `security.install-scripts` | 权限、安全与隐私 | 3 | E1 | 无安装期脚本. |
| **PARTIAL** | `security.network-credentials` | 权限、安全与隐私 | 3 | E1 | 网络、凭证与遥测行为是否披露. |
| **UNPROVEN** | `security.permission-scope` | 权限、安全与隐私 | 4 | E0 | 尚未以真实运行观察权限、网络和写入范围. |
| **N/A** | `security.major-undisclosed` | 权限、安全与隐私 | 0 | E0 | 未提交重大未披露越界行为 gate 证据. |
| **UNPROVEN** | `performance.startup-idle` | 性能与资源效率 | 4 | E0 | 尚无相对 baseline 的启动与空闲资源增量. |
| **UNPROVEN** | `performance.main-path` | 性能与资源效率 | 4 | E0 | 尚无主路径延迟、内存、网络或 token 增量. |
| **FAIL** | `ux.readme-config` | 用户体验与可运维性 | 3 | E1 | README 是否覆盖安装、配置和使用. |
| **PARTIAL** | `ux.actionable-errors` | 用户体验与可运维性 | 2 | E1 | 错误是否能指导用户下一步. |
| **UNPROVEN** | `ux.visible-result` | 用户体验与可运维性 | 3 | E0 | 尚无用户可见兑现证据. |
| **UNPROVEN** | `ux.ui-layout` | 用户体验与可运维性 | 2 | E0 | 检测到 UI 能力，但尚未验证桌面/移动与关键交互. |
| **PARTIAL** | `engineering.verification` | 测试、发布与维护质量 | 4 | E1 | tests=false, ci=false, scripts=test,typecheck. |
| **FAIL** | `engineering.release` | 测试、发布与维护质量 | 2 | E1 | artifact lockfile=false, artifact changelog=false. |
| **PARTIAL** | `engineering.support` | 测试、发布与维护质量 | 2 | E1 | security policy=false, license=true. |
| **PASS** | `engineering.maintenance` | 测试、发布与维护质量 | 2 | E1 | 固定 commit 距固定评估时点 4 天. |

> A quality interval is not a popularity ranking. UNPROVEN increases only the upper bound; Stars and identity never change the quality score.

_Generated by dsh-plugin-bench._
