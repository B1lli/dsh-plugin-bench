# DSH Plugin Bench — pilot benchmark

Generated: 2026-08-22T23:52:43.461Z

> Scores below are quality evidence intervals. Stars are adoption signals only and do not affect the score. “暂定” means evidence coverage is below 80%.

| Sample | Cohort | Type | Quality interval | Coverage | Grade | Repo Stars | Identity |
|---|---|---|---:|---:|---|---:|---|
| official-plan-mode | official-built-in | native-plugin | 41.8–89 | 52.7% | 暂定/未排名 | 185006 | OFFICIAL_BUILT_IN |
| dsh-tui | popular-self-claimed-official-feature | bundle | 58.5–84.5 | 74% | 暂定/未排名 | 2315 | SELF_CLAIMED |
| plugin-registry | beta-source-candidate | bundle | 59.8–85.6 | 74.2% | 暂定/未排名 | 56 | UNPROVEN |
| dsh-at-file | community-medium | bundle | 53.1–92.3 | 60.8% | 暂定/未排名 | 454 | COMMUNITY_DISCOVERABLE |
| anchored-standard | community-popular | preset | 26.2–83.5 | 42.7% | 暂定/未排名 | 3714 | COMMUNITY_DISCOVERABLE |
| dsh-market | existing-score-project | bundle | 30–77 | 53% | 暂定/未排名 | 55 | COMMUNITY_DISCOVERABLE |
| dsh-score | cold-existing-score-project | bundle | 73.2–90.7 | 82.5% | 可用，有明确取舍 | 0 | COMMUNITY_DISCOVERABLE |
| dsh-plugin-review | community-cold | bundle | 35–85 | 50% | 暂定/未排名 | 1 | COMMUNITY_DISCOVERABLE |
| colleague-skill | popular-skill | skill | 39.6–89.6 | 50% | 暂定/未排名 | 23808 | COMMUNITY_DISCOVERABLE |
| reactive-resume | popular-mother-repo-attribution-control | bundle | 44.3–88.7 | 55.7% | 暂定/未排名 | 41519 | COMMUNITY_DISCOVERABLE |
| zhuzhiliao | popular-topic-contamination-control | external-integration | NOT_A_PLUGIN | — | 排除 | 2853 | COMMUNITY_DISCOVERABLE |

## Evidence gaps and failures

### official-plan-mode

- UNPROVEN `function.core-path`: 尚无真实用户主路径和最终结果证据
- UNPROVEN `function.negative-path`: 尚无受支持失败路径的真实运行证据
- UNPROVEN `install.clean-profile`: 尚未在隔离 DSH_HOME 执行干净安装
- UNPROVEN `install.restart-remove`: 尚未验证重启激活与卸载清理
- UNPROVEN `integration.compose-hmr`: 尚未验证与 baseline 共存、HMR 或卸载生命周期
- UNPROVEN `reliability.repeat-run`: 尚未验证重复运行的稳定性
- UNPROVEN `reliability.state-restart`: 检测到状态能力，但尚未验证重启/部分失败后的完整性
- UNPROVEN `security.permission-scope`: 尚未以真实运行观察权限、网络和写入范围
- UNPROVEN `performance.startup-idle`: 尚无相对 baseline 的启动与空闲资源增量
- UNPROVEN `performance.main-path`: 尚无主路径延迟、内存、网络或 token 增量
- UNPROVEN `ux.visible-result`: 尚无用户可见兑现证据
- UNPROVEN `ux.ui-layout`: 检测到 UI 能力，但尚未验证桌面/移动与关键交互
- FAIL `engineering.release`: artifact lockfile=false, artifact changelog=false

### dsh-tui

- FAIL `function.automated-tests`: 未发现自动化测试
- UNPROVEN `function.negative-path`: 尚无受支持失败路径的真实运行证据
- UNPROVEN `install.restart-remove`: 尚未验证重启激活与卸载清理
- UNPROVEN `reliability.error-tests`: 静态测试形状不能证明错误或无效输入测试已执行
- UNPROVEN `reliability.timeout-cancel`: 静态测试形状不能证明取消或超时路径已执行
- UNPROVEN `reliability.repeat-run`: 尚未验证重复运行的稳定性
- UNPROVEN `reliability.state-restart`: 检测到状态能力，但尚未验证重启/部分失败后的完整性
- UNPROVEN `performance.startup-idle`: 尚无相对 baseline 的启动与空闲资源增量
- UNPROVEN `performance.main-path`: 尚无主路径延迟、内存、网络或 token 增量

### plugin-registry

- UNPROVEN `function.negative-path`: 尚无受支持失败路径的真实运行证据
- UNPROVEN `install.restart-remove`: 尚未验证重启激活与卸载清理
- UNPROVEN `reliability.timeout-cancel`: 静态测试形状不能证明取消或超时路径已执行
- UNPROVEN `reliability.repeat-run`: 尚未验证重复运行的稳定性
- UNPROVEN `reliability.state-restart`: 检测到状态能力，但尚未验证重启/部分失败后的完整性
- UNPROVEN `performance.startup-idle`: 尚无相对 baseline 的启动与空闲资源增量
- UNPROVEN `performance.main-path`: 尚无主路径延迟、内存、网络或 token 增量
- UNPROVEN `ux.ui-layout`: 检测到 UI 能力，但尚未验证桌面/移动与关键交互

### dsh-at-file

- UNPROVEN `function.core-path`: 尚无真实用户主路径和最终结果证据
- UNPROVEN `function.negative-path`: 尚无受支持失败路径的真实运行证据
- UNPROVEN `install.restart-remove`: 尚未验证重启激活与卸载清理
- UNPROVEN `reliability.repeat-run`: 尚未验证重复运行的稳定性
- UNPROVEN `reliability.state-restart`: 检测到状态能力，但尚未验证重启/部分失败后的完整性
- UNPROVEN `security.permission-scope`: 尚未以真实运行观察权限、网络和写入范围
- UNPROVEN `performance.startup-idle`: 尚无相对 baseline 的启动与空闲资源增量
- UNPROVEN `performance.main-path`: 尚无主路径延迟、内存、网络或 token 增量
- UNPROVEN `ux.visible-result`: 尚无用户可见兑现证据
- UNPROVEN `ux.ui-layout`: 检测到 UI 能力，但尚未验证桌面/移动与关键交互

### anchored-standard

- UNPROVEN `function.promise`: 核心用途与主路径是否具体可核查
- UNPROVEN `function.core-path`: 尚无真实用户主路径和最终结果证据
- UNPROVEN `function.negative-path`: 尚无受支持失败路径的真实运行证据
- FAIL `install.documentation`: 未发现与 artifact 类型匹配的安装/启用说明
- UNPROVEN `install.clean-profile`: 尚未在隔离 DSH_HOME 执行干净安装
- UNPROVEN `install.restart-remove`: 尚未验证重启激活与卸载清理
- UNPROVEN `integration.compose-hmr`: 尚未验证与 baseline 共存、HMR 或卸载生命周期
- UNPROVEN `reliability.timeout-cancel`: 静态测试形状不能证明取消或超时路径已执行
- UNPROVEN `reliability.repeat-run`: 尚未验证重复运行的稳定性
- UNPROVEN `reliability.state-restart`: 检测到状态能力，但尚未验证重启/部分失败后的完整性
- FAIL `security.license`: 未发现许可证
- UNPROVEN `security.permission-scope`: 尚未以真实运行观察权限、网络和写入范围
- UNPROVEN `performance.startup-idle`: 尚无相对 baseline 的启动与空闲资源增量
- UNPROVEN `performance.main-path`: 尚无主路径延迟、内存、网络或 token 增量
- FAIL `ux.readme-config`: README 是否覆盖安装、配置和使用
- UNPROVEN `ux.visible-result`: 尚无用户可见兑现证据
- FAIL `engineering.release`: artifact lockfile=false, artifact changelog=false
- FAIL `engineering.support`: security policy=false, license=false

### dsh-market

- UNPROVEN `function.promise`: 核心用途与主路径是否具体可核查
- FAIL `function.automated-tests`: 未发现自动化测试
- UNPROVEN `function.core-path`: 尚无真实用户主路径和最终结果证据
- UNPROVEN `function.negative-path`: 尚无受支持失败路径的真实运行证据
- FAIL `install.documentation`: 未发现与 artifact 类型匹配的安装/启用说明
- UNPROVEN `install.restart-remove`: 尚未验证重启激活与卸载清理
- UNPROVEN `reliability.error-tests`: 静态测试形状不能证明错误或无效输入测试已执行
- UNPROVEN `reliability.timeout-cancel`: 静态测试形状不能证明取消或超时路径已执行
- UNPROVEN `reliability.repeat-run`: 尚未验证重复运行的稳定性
- UNPROVEN `reliability.state-restart`: 检测到状态能力，但尚未验证重启/部分失败后的完整性
- UNPROVEN `security.permission-scope`: 尚未以真实运行观察权限、网络和写入范围
- UNPROVEN `performance.startup-idle`: 尚无相对 baseline 的启动与空闲资源增量
- UNPROVEN `performance.main-path`: 尚无主路径延迟、内存、网络或 token 增量
- FAIL `ux.readme-config`: README 是否覆盖安装、配置和使用
- UNPROVEN `ux.visible-result`: 尚无用户可见兑现证据
- UNPROVEN `ux.ui-layout`: 检测到 UI 能力，但尚未验证桌面/移动与关键交互
- FAIL `engineering.release`: artifact lockfile=false, artifact changelog=false

### dsh-score

- UNPROVEN `reliability.repeat-run`: 两个独立会话运行了不同路径，不能证明同一路径重复运行稳定
- UNPROVEN `reliability.state-restart`: 检测到状态能力，但尚未验证重启/部分失败后的完整性
- UNPROVEN `performance.startup-idle`: 尚无相对 baseline 的启动与空闲资源增量
- UNPROVEN `performance.main-path`: 尚无主路径延迟、内存、网络或 token 增量
- UNPROVEN `ux.ui-layout`: 检测到 UI 能力，但尚未验证桌面/移动与关键交互

### dsh-plugin-review

- FAIL `function.automated-tests`: 未发现自动化测试
- UNPROVEN `function.core-path`: 尚无真实用户主路径和最终结果证据
- UNPROVEN `function.negative-path`: 尚无受支持失败路径的真实运行证据
- UNPROVEN `install.clean-profile`: 尚未在隔离 DSH_HOME 执行干净安装
- UNPROVEN `install.restart-remove`: 尚未验证重启激活与卸载清理
- UNPROVEN `integration.compose-hmr`: 尚未验证与 baseline 共存、HMR 或卸载生命周期
- UNPROVEN `reliability.error-tests`: 静态测试形状不能证明错误或无效输入测试已执行
- UNPROVEN `reliability.timeout-cancel`: 静态测试形状不能证明取消或超时路径已执行
- UNPROVEN `reliability.repeat-run`: 尚未验证重复运行的稳定性
- UNPROVEN `reliability.state-restart`: 检测到状态能力，但尚未验证重启/部分失败后的完整性
- UNPROVEN `security.permission-scope`: 尚未以真实运行观察权限、网络和写入范围
- UNPROVEN `performance.startup-idle`: 尚无相对 baseline 的启动与空闲资源增量
- UNPROVEN `performance.main-path`: 尚无主路径延迟、内存、网络或 token 增量
- UNPROVEN `ux.actionable-errors`: 错误是否能指导用户下一步
- UNPROVEN `ux.visible-result`: 尚无用户可见兑现证据
- UNPROVEN `ux.ui-layout`: 检测到 UI 能力，但尚未验证桌面/移动与关键交互
- FAIL `engineering.verification`: tests=false, ci=false, scripts=none
- FAIL `engineering.release`: artifact lockfile=false, artifact changelog=false

### colleague-skill

- UNPROVEN `function.core-path`: 尚无真实用户主路径和最终结果证据
- UNPROVEN `function.negative-path`: 尚无受支持失败路径的真实运行证据
- UNPROVEN `install.clean-profile`: 尚未在隔离 DSH_HOME 执行干净安装
- UNPROVEN `install.restart-remove`: 尚未验证重启激活与卸载清理
- UNPROVEN `integration.compose-hmr`: 尚未验证与 baseline 共存、HMR 或卸载生命周期
- UNPROVEN `reliability.repeat-run`: 尚未验证重复运行的稳定性
- UNPROVEN `reliability.state-restart`: 检测到状态能力，但尚未验证重启/部分失败后的完整性
- UNPROVEN `security.permission-scope`: 尚未以真实运行观察权限、网络和写入范围
- UNPROVEN `performance.startup-idle`: 尚无相对 baseline 的启动与空闲资源增量
- UNPROVEN `performance.main-path`: 尚无主路径延迟、内存、网络或 token 增量
- UNPROVEN `ux.visible-result`: 尚无用户可见兑现证据
- FAIL `engineering.release`: artifact lockfile=false, artifact changelog=false

### reactive-resume

- UNPROVEN `function.core-path`: 尚无真实用户主路径和最终结果证据
- UNPROVEN `function.negative-path`: 尚无受支持失败路径的真实运行证据
- UNPROVEN `install.clean-profile`: 尚未在隔离 DSH_HOME 执行干净安装
- UNPROVEN `install.restart-remove`: 尚未验证重启激活与卸载清理
- UNPROVEN `integration.compose-hmr`: 尚未验证与 baseline 共存、HMR 或卸载生命周期
- UNPROVEN `reliability.repeat-run`: 尚未验证重复运行的稳定性
- UNPROVEN `reliability.state-restart`: 检测到状态能力，但尚未验证重启/部分失败后的完整性
- UNPROVEN `security.permission-scope`: 尚未以真实运行观察权限、网络和写入范围
- UNPROVEN `performance.startup-idle`: 尚无相对 baseline 的启动与空闲资源增量
- UNPROVEN `performance.main-path`: 尚无主路径延迟、内存、网络或 token 增量
- UNPROVEN `ux.visible-result`: 尚无用户可见兑现证据
- UNPROVEN `ux.ui-layout`: 检测到 UI 能力，但尚未验证桌面/移动与关键交互
- FAIL `engineering.release`: artifact lockfile=false, artifact changelog=false

## Runtime evidence ledger

> These entries are operator-supplied attestations bound to the exact commit and artifact shown in benchmark.json.

### official-plan-mode

- PASS E2 `function.automated-tests`: 官方 plan-mode 聚焦测试 4 个文件、83 个测试全部通过 — corepack pnpm exec vitest run packages/plan/plan-mode/tests
- PASS E2 `engineering.verification`: 官方 plan-mode 聚焦测试 4 个文件、83 个测试全部通过 — corepack pnpm exec vitest run packages/plan/plan-mode/tests

### dsh-tui

- PASS E4 `function.core-path`: 真实 TTY 启动并渲染可交互 dsh-TUI 0.8.6 主界面 — evidence/raw/plugin-runtime-pilot.md#dsh-tui-086
- PASS E3 `install.clean-profile`: npm 包 0.8.6 从空 DSH_HOME 安装并解析完整 patch — evidence/raw/plugin-runtime-pilot.md#dsh-tui-086
- PARTIAL E3 `integration.compose-hmr`: 可在 rc.8 启动，但运行时告警称该发布物仅验证到 rc.7，与源码验证说明存在漂移 — evidence/raw/plugin-runtime-pilot.md#dsh-tui-086
- PARTIAL E4 `security.permission-scope`: 使用隔离 DSH_HOME，未观察到工作区写入；未做系统调用级审计 — evidence/raw/plugin-runtime-pilot.md#dsh-tui-086
- PASS E4 `ux.visible-result`: 主界面、模型状态、输入区和兼容性告警均可见 — evidence/raw/plugin-runtime-pilot.md#dsh-tui-086
- PARTIAL E4 `ux.ui-layout`: 验证单一桌面 TTY；未覆盖不同终端尺寸和配色 — evidence/raw/plugin-runtime-pilot.md#dsh-tui-086

### plugin-registry

- PASS E4 `function.core-path`: 运行时注册四个插件工具，/api/plugin-console/installed 返回 200 与实际安装列表 — evidence/raw/plugin-runtime-pilot.md#plugin-registry-010
- PASS E3 `install.clean-profile`: @vlln/plugin-console@0.1.0 从空 DSH_HOME 安装、解析并启动 Web profile — evidence/raw/plugin-runtime-pilot.md#plugin-registry-010
- PASS E3 `integration.compose-hmr`: 与官方 Web baseline 共存并完成插件工具和 HTTP 路由注册 — evidence/raw/plugin-runtime-pilot.md#plugin-registry-010
- PARTIAL E4 `security.permission-scope`: 使用隔离 DSH_HOME 且状态端点只读；安装/卸载工具的写入边界未做系统调用级审计 — evidence/raw/plugin-runtime-pilot.md#plugin-registry-010
- PARTIAL E4 `ux.visible-result`: API 状态结果可见；浏览器面板交互未完成 — evidence/raw/plugin-runtime-pilot.md#plugin-registry-010

### dsh-at-file

- PASS E2 `function.automated-tests`: 按项目支持的 sibling 源码布局执行 164 个测试，全部通过 — supported sibling layout pnpm run check: 164 tests passed
- PASS E3 `install.clean-profile`: README 固定 tarball v0.6.7 从空 DSH_HOME 安装并启动 Web profile — evidence/raw/plugin-runtime-pilot.md#dsh-at-file-v067
- PASS E3 `integration.compose-hmr`: 配置解析并与官方 Web baseline 共存启动 — evidence/raw/plugin-runtime-pilot.md#dsh-at-file-v067
- PARTIAL E2 `engineering.verification`: 按支持的 sibling 源码布局完成 typecheck、164 个测试与 build；冻结安装因 workspace 配置与 lockfile 不一致失败 — pnpm install --frozen-lockfile: config mismatch; supported sibling layout pnpm run check: 164 tests plus typecheck/build passed

### anchored-standard

- PASS E2 `function.automated-tests`: npm 安装后执行项目测试，205 个测试全部通过 — npm install --ignore-scripts && npm test: 205 passed
- PASS E2 `engineering.verification`: npm 安装完成，205 个项目测试全部通过 — npm install --ignore-scripts && npm test: 205 passed

### dsh-market

- PASS E3 `install.clean-profile`: @dsh-market/plugin 从空 DSH_HOME 安装、解析并启动 Web profile — evidence/raw/plugin-runtime-pilot.md#dsh-market-021
- PASS E3 `integration.compose-hmr`: 与官方 Web baseline 共存启动 — evidence/raw/plugin-runtime-pilot.md#dsh-market-021

### dsh-score

- PASS E2 `function.automated-tests`: 13 个文件中的 91 个自动化测试全部通过 — evidence/raw/dsh-score-run.md#engineering-verification
- PASS E4 `function.core-path`: DeepSeek agent 实际调用 score 工具并得到结构化评分结果 — evidence/raw/dsh-score-run.md#core-path
- PASS E4 `function.negative-path`: 空 target 返回明确可行动错误，Harness 会话保持可用 — evidence/raw/dsh-score-run.md#negative-path
- PASS E3 `install.clean-profile`: 从空 DSH_HOME 安装到 headless/web profile，配置解析和 Web 启动均成功 — evidence/raw/dsh-score-run.md#clean-profile
- PARTIAL E3 `install.restart-remove`: 重启激活成功；官方 CLI remove 删除依赖后未同步清理 profile bundle 行，归因为平台级卸载缺陷 — evidence/raw/dsh-score-run.md#restart-remove
- PASS E3 `integration.compose-hmr`: 与官方 baseline profile 共存并可在 Web/Headless 两种 profile 启动 — evidence/raw/dsh-score-run.md#clean-profile
- PARTIAL E4 `security.permission-scope`: 观察到 GitHub/npm 只读检查且未修改目标仓库；未完成系统调用级网络与文件审计 — evidence/raw/dsh-score-run.md#permission-scope
- PASS E4 `ux.visible-result`: 用户可见结果包含总分、等级、维度和证据状态 — evidence/raw/dsh-score-run.md#repeat-run-and-visible-result
- PASS E2 `engineering.verification`: 冻结安装、两套类型检查和 13 个文件中的 91 个测试全部通过 — evidence/raw/dsh-score-run.md#engineering-verification
