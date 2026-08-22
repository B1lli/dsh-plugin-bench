# DSH Plugin Bench

面向 DeepSeek Harness 插件的证据化、端到端、类型感知质量评分卡。

[English](./README.md) · [首轮榜单](./reports/benchmark.md) · [评分规则](./rubric.json) · [参与贡献](./CONTRIBUTING.md)

它不回答“哪个仓库 Stars 更多”，而回答：

> 对这个确定的插件 artifact 和 commit，哪些质量已经被证据证明，哪些仍然未知？

Bundle、原生 Cordis 插件、Skill、Preset 和只有 `dsh-plugin` topic 的仓库分别判断。Stars、目录收录和“官方/内测”身份只作旁栏信息，不进入质量分。

[![DSH 质量评分卡示例](./reports/scorecards/dsh-score.svg)](./reports/scorecards/dsh-score.md)

_这是固定 `dsh-score` pilot artifact 的示例输出；点击徽章可查看完整证据账本。_

## 30 秒开始

源码版本已在 GitHub 发布；npm 包尚未发布，因此请从源码 checkout 运行：

```bash
npm ci
npm run score -- owner/repo
```

生成便于贴进 README、Issue 或评审文档的 Markdown 评分卡与 SVG 徽章：

```bash
npm run score -- owner/repo --ref <40位commit> --output scorecard.md
npm run score -- owner/repo --ref <40位commit> --output dsh-quality.svg
```

`.json`、`.md`、`.svg` 会自动选择输出格式，也可以显式指定：

```bash
npm run score -- owner/repo --format json --output report.json
npm run score -- owner/repo --format markdown --output report.md
npm run score -- owner/repo --format badge --output badge.svg
```

运行 `npm run score -- --help` 查看全部选项。默认不覆盖已有文件；确实需要覆盖时显式加 `--force`。

## 把 UNPROVEN 变成证据

静态扫描默认只产生 E1。发现测试文件只证明“有测试”，不证明“测试通过”。先生成已经绑定 commit/artifact 的 runtime evidence 模板：

```bash
npm run score -- owner/repo \
  --ref <40位commit> \
  --artifact packages/your-plugin \
  --runtime-template runtime-evidence.json
```

只填写真实执行过的检查，再评分：

```bash
npm run score -- owner/repo \
  --ref <40位commit> \
  --artifact packages/your-plugin \
  --runtime runtime-evidence.json \
  --output scorecard.md
```

E3+ 必须填写非空的 DSH、Node、OS 与准确 profile 名，并确认隔离环境。模板初始 profile 为空且 `isolatedDshHome: false`，避免尚未完成隔离运行就误领证据；原样回填空白模板也不会覆盖静态扫描已经证明的结论。

## 分数怎么读

- `PASS`：证据支持该项，拿满分。
- `PARTIAL`：只证明一部分，拿一半。
- `FAIL`：出现可复现失败，0 分。
- `UNPROVEN`：没有足够证据，只增加理论上界。
- `N/A`：对该插件类型不适用，不进入分母。

覆盖率低于 80% 时只给“暂定/未排名”。隔离安装确认失败时区间最高 39；核心主路径确认失败时最高 49；重大未披露越界行为标为 `UNSAFE`。这些是公开的 pilot v1 治理阈值，不是统计学最优值。

## 八个维度

| 维度 | 权重 |
|---|---:|
| 功能价值与结果正确性 | 20 |
| 安装、激活、升级与卸载 | 12 |
| DSH 原生集成与可组合性 | 13 |
| 可靠性与状态完整性 | 12 |
| 权限、安全与隐私 | 15 |
| 性能与资源效率 | 8 |
| 用户体验与可运维性 | 10 |
| 测试、发布与维护质量 | 10 |

完整定义见 [`rubric.json`](./rubric.json)。

## 首轮结果与证据

- [完整榜单](./reports/benchmark.md)
- [每个项目的分享卡片与徽章](./reports/scorecards/README.md)
- [生态检索与定位](./reports/ecosystem-gap.md)
- [GPT 独立审核](./evidence/reviews/gpt-review-transcript.md)
- [DeepSeek Harness agent 审核](./evidence/reviews/deepseek-final-review-transcript.md)

首轮 11 个固定样本里，只有 `dsh-score` 达到 80% 正式覆盖门槛。这不代表它天然是“最佳插件”，只表示其他样本在可负责比较之前仍缺少 commit-bound runtime evidence。

## 安全与发布边界

默认只读远端源码和元数据，不安装或执行目标代码。公开结果必须包含完整 commit、artifact、评估时间和 path-scoped commitAt；凭证值不得进入报告、模板、Issue 或 fixture。

`0.2.0` 已作为 GitHub 源码版本发布。发布机器当前没有 npm 登录态，因此 npm
发布仍为待办；2026-08-22 检查时包名尚未被占用。GitHub Release 不代表 npm
包已经可安装。

```bash
npm run check
npm run benchmark
npm run pack:check
```

MIT
