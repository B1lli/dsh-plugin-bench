# DSH Plugin Quality Scorecard

**Target:** PerryLink/dsh-score

| Provenance | Value |
|---|---|
| Commit | f2f173f520eea0aaeb35e93dc2e5298433a4bf26 |
| Artifact | . |
| Evaluated at | 2026-08-20T17:38:26.245Z |
| Artifact commit at | 2026-08-18T23:02:40+08:00 |
| Identity | COMMUNITY_DISCOVERABLE |
| Classification | bundle |

## Result

- **Quality interval:** 73.2–90.7/100
- **Evidence coverage:** 82.5%
- **Grade:** 可用，有明确取舍
- **Adoption (not scored):** ★ 0, 0 forks

| Dimension | Confirmed | Possible | UNPROVEN |
|---|---:|---:|---:|
| 功能价值与结果正确性 | 18 | 20 | 0 |
| 安装、激活、升级与卸载 | 10.5 | 12 | 0 |
| DSH 原生集成与可组合性 | 10 | 10 | 0 |
| 可靠性与状态完整性 | 2.5 | 12 | 7 |
| 权限、安全与隐私 | 13 | 15 | 0 |
| 性能与资源效率 | 0 | 8 | 8 |
| 用户体验与可运维性 | 7 | 10 | 2 |
| 测试、发布与维护质量 | 10 | 10 | 0 |

## Evidence gaps and failures

- **UNPROVEN** `performance.main-path` (4 points): 尚无主路径延迟、内存、网络或 token 增量.
- **UNPROVEN** `performance.startup-idle` (4 points): 尚无相对 baseline 的启动与空闲资源增量.
- **UNPROVEN** `reliability.state-restart` (4 points): 检测到状态能力，但尚未验证重启/部分失败后的完整性.
- **UNPROVEN** `reliability.repeat-run` (3 points): 两个独立会话运行了不同路径，不能证明同一路径重复运行稳定. Evidence: [evidence/raw/dsh-score-run.md#repeat-run-and-visible-result](../../evidence/raw/dsh-score-run.md#repeat-run-and-visible-result).
- **UNPROVEN** `ux.ui-layout` (2 points): 检测到 UI 能力，但尚未验证桌面/移动与关键交互.
- **PARTIAL** `function.promise` (4 points): 核心用途与主路径是否具体可核查. Evidence: README.md.
- **PARTIAL** `security.permission-scope` (4 points): 观察到 GitHub/npm 只读检查且未修改目标仓库；未完成系统调用级网络与文件审计. Evidence: [evidence/raw/dsh-score-run.md#permission-scope](../../evidence/raw/dsh-score-run.md#permission-scope).
- **PARTIAL** `install.restart-remove` (3 points): 重启激活成功；官方 CLI remove 删除依赖后未同步清理 profile bundle 行，归因为平台级卸载缺陷. Evidence: [evidence/raw/dsh-score-run.md#restart-remove](../../evidence/raw/dsh-score-run.md#restart-remove).
- **PARTIAL** `reliability.error-tests` (3 points): 静态测试形状不能证明错误或无效输入测试已执行.
- **PARTIAL** `reliability.timeout-cancel` (2 points): 静态测试形状不能证明取消或超时路径已执行.
- **PARTIAL** `ux.actionable-errors` (2 points): 错误是否能指导用户下一步.

## Complete evidence ledger

| Status | Check | Dimension | Weight | Level | Finding and evidence |
|---|---|---|---:|---|---|
| **PARTIAL** | `function.promise` | 功能价值与结果正确性 | 4 | E1 | 核心用途与主路径是否具体可核查. Evidence: README.md. |
| **PASS** | `function.automated-tests` | 功能价值与结果正确性 | 5 | E2 | 13 个文件中的 91 个自动化测试全部通过. Evidence: [evidence/raw/dsh-score-run.md#engineering-verification](../../evidence/raw/dsh-score-run.md#engineering-verification). |
| **PASS** | `function.core-path` | 功能价值与结果正确性 | 8 | E4 | DeepSeek agent 实际调用 score 工具并得到结构化评分结果. Evidence: [evidence/raw/dsh-score-run.md#core-path](../../evidence/raw/dsh-score-run.md#core-path). |
| **PASS** | `function.negative-path` | 功能价值与结果正确性 | 3 | E4 | 空 target 返回明确可行动错误，Harness 会话保持可用. Evidence: [evidence/raw/dsh-score-run.md#negative-path](../../evidence/raw/dsh-score-run.md#negative-path). |
| **PASS** | `install.documentation` | 安装、激活、升级与卸载 | 3 | E1 | README 提供与 artifact 类型匹配的安装/启用说明. Evidence: README.md. |
| **PASS** | `install.manifest` | 安装、激活、升级与卸载 | 3 | E1 | dsh.bundle.patch 均可解析. Evidence: cordis.patch.yml. |
| **PASS** | `install.clean-profile` | 安装、激活、升级与卸载 | 3 | E3 | 从空 DSH_HOME 安装到 headless/web profile，配置解析和 Web 启动均成功. Evidence: [evidence/raw/dsh-score-run.md#clean-profile](../../evidence/raw/dsh-score-run.md#clean-profile). |
| **PARTIAL** | `install.restart-remove` | 安装、激活、升级与卸载 | 3 | E3 | 重启激活成功；官方 CLI remove 删除依赖后未同步清理 profile bundle 行，归因为平台级卸载缺陷. Evidence: [evidence/raw/dsh-score-run.md#restart-remove](../../evidence/raw/dsh-score-run.md#restart-remove). |
| **PASS** | `integration.public-seam` | DSH 原生集成与可组合性 | 3 | E1 | 声明 7 个 DSH/Cordis 依赖. Evidence: @deepseek-ai/cordis@^4.0.1; @deepseek-ai/dsh-agent@0.1.0-rc.6; @deepseek-ai/dsh-commands@0.1.0-rc.6; @deepseek-ai/dsh-jobs@0.1.0-rc.6; @deepseek-ai/dsh-storage-domain@0.1.0-rc.6; @deepseek-ai/dsh-subprocess@0.1.0-rc.6; @deepseek-ai/dsh-tools@0.1.0-rc.6. |
| **PASS** | `integration.version-range` | DSH 原生集成与可组合性 | 3 | E1 | 声明外部 DSH/Cordis 版本范围. Evidence: @deepseek-ai/cordis@^4.0.1; @deepseek-ai/dsh-agent@0.1.0-rc.6; @deepseek-ai/dsh-commands@0.1.0-rc.6; @deepseek-ai/dsh-jobs@0.1.0-rc.6; @deepseek-ai/dsh-storage-domain@0.1.0-rc.6; @deepseek-ai/dsh-subprocess@0.1.0-rc.6; @deepseek-ai/dsh-tools@0.1.0-rc.6. |
| **N/A** | `integration.lifecycle` | DSH 原生集成与可组合性 | 3 | E1 | 未发现需额外管理的 timer/watcher/server 资源. |
| **PASS** | `integration.config-validation` | DSH 原生集成与可组合性 | 2 | E1 | 配置是否在最早可判断处校验. |
| **PASS** | `integration.compose-hmr` | DSH 原生集成与可组合性 | 2 | E3 | 与官方 baseline profile 共存并可在 Web/Headless 两种 profile 启动. Evidence: [evidence/raw/dsh-score-run.md#clean-profile](../../evidence/raw/dsh-score-run.md#clean-profile). |
| **PARTIAL** | `reliability.error-tests` | 可靠性与状态完整性 | 3 | E1 | 静态测试形状不能证明错误或无效输入测试已执行. |
| **PARTIAL** | `reliability.timeout-cancel` | 可靠性与状态完整性 | 2 | E1 | 静态测试形状不能证明取消或超时路径已执行. |
| **UNPROVEN** | `reliability.repeat-run` | 可靠性与状态完整性 | 3 | E4 | 两个独立会话运行了不同路径，不能证明同一路径重复运行稳定. Evidence: [evidence/raw/dsh-score-run.md#repeat-run-and-visible-result](../../evidence/raw/dsh-score-run.md#repeat-run-and-visible-result). |
| **UNPROVEN** | `reliability.state-restart` | 可靠性与状态完整性 | 4 | E0 | 检测到状态能力，但尚未验证重启/部分失败后的完整性. |
| **PASS** | `security.license` | 权限、安全与隐私 | 2 | E1 | 发现许可证声明. |
| **PASS** | `security.embedded-secret` | 权限、安全与隐私 | 3 | E1 | 未在运行源码中发现常见长效凭证字面量. |
| **PASS** | `security.install-scripts` | 权限、安全与隐私 | 3 | E1 | 安装期脚本：prepare. Evidence: prepare: node scripts/prepare.mjs. |
| **PASS** | `security.network-credentials` | 权限、安全与隐私 | 3 | E1 | 网络、凭证与遥测行为是否披露. |
| **PARTIAL** | `security.permission-scope` | 权限、安全与隐私 | 4 | E4 | 观察到 GitHub/npm 只读检查且未修改目标仓库；未完成系统调用级网络与文件审计. Evidence: [evidence/raw/dsh-score-run.md#permission-scope](../../evidence/raw/dsh-score-run.md#permission-scope). |
| **N/A** | `security.major-undisclosed` | 权限、安全与隐私 | 0 | E0 | 未提交重大未披露越界行为 gate 证据. |
| **UNPROVEN** | `performance.startup-idle` | 性能与资源效率 | 4 | E0 | 尚无相对 baseline 的启动与空闲资源增量. |
| **UNPROVEN** | `performance.main-path` | 性能与资源效率 | 4 | E0 | 尚无主路径延迟、内存、网络或 token 增量. |
| **PASS** | `ux.readme-config` | 用户体验与可运维性 | 3 | E1 | README 是否覆盖安装、配置和使用. |
| **PARTIAL** | `ux.actionable-errors` | 用户体验与可运维性 | 2 | E1 | 错误是否能指导用户下一步. |
| **PASS** | `ux.visible-result` | 用户体验与可运维性 | 3 | E4 | 用户可见结果包含总分、等级、维度和证据状态. Evidence: [evidence/raw/dsh-score-run.md#repeat-run-and-visible-result](../../evidence/raw/dsh-score-run.md#repeat-run-and-visible-result). |
| **UNPROVEN** | `ux.ui-layout` | 用户体验与可运维性 | 2 | E0 | 检测到 UI 能力，但尚未验证桌面/移动与关键交互. |
| **PASS** | `engineering.verification` | 测试、发布与维护质量 | 4 | E2 | 冻结安装、两套类型检查和 13 个文件中的 91 个测试全部通过. Evidence: [evidence/raw/dsh-score-run.md#engineering-verification](../../evidence/raw/dsh-score-run.md#engineering-verification). |
| **PASS** | `engineering.release` | 测试、发布与维护质量 | 2 | E1 | artifact lockfile=true, artifact changelog=true. |
| **PASS** | `engineering.support` | 测试、发布与维护质量 | 2 | E1 | security policy=true, license=true. |
| **PASS** | `engineering.maintenance` | 测试、发布与维护质量 | 2 | E1 | 固定 commit 距固定评估时点 2 天. |

> A quality interval is not a popularity ranking. UNPROVEN increases only the upper bound; Stars and identity never change the quality score.

_Generated by dsh-plugin-bench._
