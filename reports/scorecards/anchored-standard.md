# DSH Plugin Quality Scorecard

**Target:** xiaobright/dsh-anchored-standard

| Provenance | Value |
|---|---|
| Commit | 25f21aefaf8ddc414da54d2e581e43740d977c6e |
| Artifact | zero-anchored-standard |
| Evaluated at | 2026-08-20T17:38:26.245Z |
| Artifact commit at | 2026-08-17T02:11:11Z |
| Identity | COMMUNITY_DISCOVERABLE |
| Classification | preset |

## Result

- **Quality interval:** 26.2–83.5/100
- **Evidence coverage:** 42.7%
- **Grade:** 暂定/未排名
- **Adoption (not scored):** ★ 3714, 111 forks

| Dimension | Confirmed | Possible | UNPROVEN |
|---|---:|---:|---:|
| 功能价值与结果正确性 | 5 | 20 | 15 |
| 安装、激活、升级与卸载 | 0 | 9 | 6 |
| DSH 原生集成与可组合性 | 3 | 5 | 2 |
| 可靠性与状态完整性 | 0 | 9 | 9 |
| 权限、安全与隐私 | 7.5 | 15 | 4 |
| 性能与资源效率 | 0 | 8 | 8 |
| 用户体验与可运维性 | 0 | 6 | 3 |
| 测试、发布与维护质量 | 6 | 10 | 0 |

## Evidence gaps and failures

- **FAIL** `install.documentation` (3 points): 未发现与 artifact 类型匹配的安装/启用说明.
- **FAIL** `ux.readme-config` (3 points): README 是否覆盖安装、配置和使用.
- **FAIL** `engineering.release` (2 points): artifact lockfile=false, artifact changelog=false.
- **FAIL** `engineering.support` (2 points): security policy=false, license=false.
- **FAIL** `security.license` (2 points): 未发现许可证.
- **UNPROVEN** `function.core-path` (8 points): 尚无真实用户主路径和最终结果证据.
- **UNPROVEN** `function.promise` (4 points): 核心用途与主路径是否具体可核查.
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
- **UNPROVEN** `reliability.timeout-cancel` (2 points): 静态测试形状不能证明取消或超时路径已执行.
- **PARTIAL** `security.network-credentials` (3 points): 网络、凭证与遥测行为是否披露.

## Complete evidence ledger

| Status | Check | Dimension | Weight | Level | Finding and evidence |
|---|---|---|---:|---|---|
| **UNPROVEN** | `function.promise` | 功能价值与结果正确性 | 4 | E1 | 核心用途与主路径是否具体可核查. |
| **PASS** | `function.automated-tests` | 功能价值与结果正确性 | 5 | E2 | npm 安装后执行项目测试，205 个测试全部通过. Evidence: npm install --ignore-scripts && npm test: 205 passed. |
| **UNPROVEN** | `function.core-path` | 功能价值与结果正确性 | 8 | E0 | 尚无真实用户主路径和最终结果证据. |
| **UNPROVEN** | `function.negative-path` | 功能价值与结果正确性 | 3 | E0 | 尚无受支持失败路径的真实运行证据. |
| **FAIL** | `install.documentation` | 安装、激活、升级与卸载 | 3 | E1 | 未发现与 artifact 类型匹配的安装/启用说明. |
| **N/A** | `install.manifest` | 安装、激活、升级与卸载 | 3 | E1 | 该类型不使用 bundle patch. |
| **UNPROVEN** | `install.clean-profile` | 安装、激活、升级与卸载 | 3 | E0 | 尚未在隔离 DSH_HOME 执行干净安装. |
| **UNPROVEN** | `install.restart-remove` | 安装、激活、升级与卸载 | 3 | E0 | 尚未验证重启激活与卸载清理. |
| **PASS** | `integration.public-seam` | DSH 原生集成与可组合性 | 3 | E1 | 未从包依赖确认官方扩展接口. |
| **N/A** | `integration.version-range` | DSH 原生集成与可组合性 | 3 | E1 | 未确认可发布物的兼容版本范围. |
| **N/A** | `integration.lifecycle` | DSH 原生集成与可组合性 | 3 | E1 | 未发现需额外管理的 timer/watcher/server 资源. |
| **N/A** | `integration.config-validation` | DSH 原生集成与可组合性 | 2 | E1 | 配置是否在最早可判断处校验. |
| **UNPROVEN** | `integration.compose-hmr` | DSH 原生集成与可组合性 | 2 | E0 | 尚未验证与 baseline 共存、HMR 或卸载生命周期. |
| **N/A** | `reliability.error-tests` | 可靠性与状态完整性 | 3 | E1 | 静态测试形状不能证明错误或无效输入测试已执行. |
| **UNPROVEN** | `reliability.timeout-cancel` | 可靠性与状态完整性 | 2 | E1 | 静态测试形状不能证明取消或超时路径已执行. |
| **UNPROVEN** | `reliability.repeat-run` | 可靠性与状态完整性 | 3 | E0 | 尚未验证重复运行的稳定性. |
| **UNPROVEN** | `reliability.state-restart` | 可靠性与状态完整性 | 4 | E0 | 检测到状态能力，但尚未验证重启/部分失败后的完整性. |
| **FAIL** | `security.license` | 权限、安全与隐私 | 2 | E1 | 未发现许可证. |
| **PASS** | `security.embedded-secret` | 权限、安全与隐私 | 3 | E1 | 未在运行源码中发现常见长效凭证字面量. |
| **PASS** | `security.install-scripts` | 权限、安全与隐私 | 3 | E1 | 无安装期脚本. |
| **PARTIAL** | `security.network-credentials` | 权限、安全与隐私 | 3 | E1 | 网络、凭证与遥测行为是否披露. |
| **UNPROVEN** | `security.permission-scope` | 权限、安全与隐私 | 4 | E0 | 尚未以真实运行观察权限、网络和写入范围. |
| **N/A** | `security.major-undisclosed` | 权限、安全与隐私 | 0 | E0 | 未提交重大未披露越界行为 gate 证据. |
| **UNPROVEN** | `performance.startup-idle` | 性能与资源效率 | 4 | E0 | 尚无相对 baseline 的启动与空闲资源增量. |
| **UNPROVEN** | `performance.main-path` | 性能与资源效率 | 4 | E0 | 尚无主路径延迟、内存、网络或 token 增量. |
| **FAIL** | `ux.readme-config` | 用户体验与可运维性 | 3 | E1 | README 是否覆盖安装、配置和使用. |
| **N/A** | `ux.actionable-errors` | 用户体验与可运维性 | 2 | E1 | 错误是否能指导用户下一步. |
| **UNPROVEN** | `ux.visible-result` | 用户体验与可运维性 | 3 | E0 | 尚无用户可见兑现证据. |
| **N/A** | `ux.ui-layout` | 用户体验与可运维性 | 2 | E1 | 非 UI 插件. |
| **PASS** | `engineering.verification` | 测试、发布与维护质量 | 4 | E2 | npm 安装完成，205 个项目测试全部通过. Evidence: npm install --ignore-scripts && npm test: 205 passed. |
| **FAIL** | `engineering.release` | 测试、发布与维护质量 | 2 | E1 | artifact lockfile=false, artifact changelog=false. |
| **FAIL** | `engineering.support` | 测试、发布与维护质量 | 2 | E1 | security policy=false, license=false. |
| **PASS** | `engineering.maintenance` | 测试、发布与维护质量 | 2 | E1 | 固定 commit 距固定评估时点 3 天. |

> A quality interval is not a popularity ranking. UNPROVEN increases only the upper bound; Stars and identity never change the quality score.

_Generated by dsh-plugin-bench._
