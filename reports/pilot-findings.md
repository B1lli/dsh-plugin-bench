# 首轮样本评估说明

完整可机读结果见 `benchmark.json`，表格见 `benchmark.md`。本轮固定官方 Harness `0.1.0-rc.8`，真实运行均使用临时 `DSH_HOME`，未创建 Docker 资源。

## 样本覆盖

- 热门：`dsh-TUI`、`dsh-anchored-standard`、`colleague-skill`、`reactive-resume`。
- 中小项目：`dsh-at-file`、`dsh-market`、`plugin-registry`。
- 冷门：`dsh-score`（0 Repo Star）、`dsh-plugin-review`（1 Repo Star）。
- 官方标尺：官方仓库内置 `plan-mode`。
- topic 污染对照：`zhuzhiliao`，有 DSH 相关外围集成但没有可由 DSH 加载的 artifact，因此判定 `NOT_A_PLUGIN`。

## 真实运行事实

- `dsh-score`：91 tests、类型检查、隔离安装、Web/Headless 启动、DeepSeek agent 成功路径与负路径均通过；但两次会话走的是不同路径，不能冒充重复运行证据，因此该项保持 `UNPROVEN`。综合确认分与覆盖率以 `benchmark.md` 的当前生成结果为准，是本轮唯一达到正式等级门槛的样本。其自身对自己给出 98/A，但安装维度显示 `no-evidence`，说明“未知维度重归一化”会制造虚高。
- `dsh-TUI`：评分对象改为 npm `0.8.6` 的 `gitHead`，隔离安装和真实 TTY 主界面通过；发布物运行时称只验证至 rc.7，而本轮为 rc.8，故兼容集成只记 `PARTIAL`。原先在较新源码 commit 执行的 build 不再套用到发布物，最终区间以 `benchmark.md` 为准。
- `plugin-registry`：评分边界固定到 `packages/plugin/console`，commit 固定为 npm `0.1.0` 的 `gitHead`；隔离安装、Web 启动、四个工具注册和 installed API 通过。原先在较新源码 commit 执行的 50 tests/build 已从这份发布物报告移除，最终区间以 `benchmark.md` 为准。
- `dsh-at-file`：164 tests/typecheck/build 与隔离安装启动通过；同样存在 frozen lock 配置不一致，且核心 UI 用户路径未测，最终区间以 `benchmark.md` 为准。
- `dsh-market`：评分边界固定到 `plugin/ui`，commit 固定为 npm `0.2.1` 的 `gitHead`；母仓 collector 的 48 tests 不冒充 UI 插件功能测试，隔离安装启动通过但市场 UI 主路径未测，最终区间以 `benchmark.md` 为准。
- 官方 `plan-mode`：83 个聚焦测试通过，但本轮没有把它作为普通外部插件走安装/用户路径，所以仍保持暂定；同一 artifact 改成社区身份时质量检查和分数完全相同。

其余项目目前主要是 E1/E2 快扫，分数区间较宽，只能用于暴露待补证据，不能冒充质量排名。

发布包运行证据的包名、版本与 `gitHead`/tag 映射见 `evidence/raw/plugin-runtime-pilot.md`；若运行的是发布包而不是本地 checkout，评分目标就固定到该发布包对应 commit，不把另一个 main 分支快照套进来。

## 平台级问题

`dsh-score` 卸载时，官方 CLI 已从 profile dependencies 删除包，但 bundle 列表残留，下一次配置解析失败。该现象归因为 Harness `plugin remove` 的平台级生命周期缺陷，不应只扣到单个插件；本轮对相关卸载项记 `PARTIAL` 并保留归因说明。
