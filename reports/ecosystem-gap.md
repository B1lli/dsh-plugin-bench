# 生态检索与项目定位

检索日期：2026-08-20。结论不是“生态里完全没有评分项目”，而是：已经有目录、安装验证、Stars 排行、静态健康评分和单项安全审计；公开检索范围内，尚未发现把真实功能结果、完整 DSH 生命周期、可靠性、安全隐私、效率、UX 和工程维护合成，并按插件类型校准、显式保留 `UNPROVEN` 的端到端综合评分。

因此本项目不会宣传“首个 DeepSeek Harness 插件榜单”，定位为“证据化、端到端、类型感知的 DSH 插件综合质量基准”。

## 已存在的相邻项目

| 项目 | 已解决的问题 | 与本项目的边界 |
|---|---|---|
| [DSH Plugin Leaderboard](https://dshpluginleaderboard.com/) | 隔离执行 `plugin add`、检查 manifest，然后按 Stars 排序 | 页面明确验证不等于安全；Stars 是传播度，不是质量 |
| [PerryLink/dsh-score](https://github.com/PerryLink/dsh-score) | 五维证据感知评分插件 | 主路径实测中，安装维度为 `no-evidence` 时仍重归一化得到 98/A；本项目保留未知上界并设覆盖率门槛 |
| [zoahdev/dsh-quality-score](https://github.com/zoahdev/dsh-quality-score) | npm 元数据质量卡 | 侧重元数据，不覆盖完整用户路径 |
| [863683348/dsh-plugin-audit](https://github.com/863683348/dsh-plugin-audit) | 四类静态健康信号、安全否决与 topic-farming 限制 | 仍是静态审计，不等于功能兑现 |
| [2BingLing/dsh-market](https://github.com/2BingLing/dsh-market) | 五维实用评分和市场 UI | 权重公开，但不是完整 E1–E5 运行证据链 |
| [AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) | 兼容性雷达与人工目录 | 是发现/兼容性层，不是综合功能质量结论 |
| [第三方安全审计](https://github.com/deepseek-ai/deepseek-harness/discussions/454) | 隔离 DSH_HOME、固定版本的插件模型安全研究 | 安全是综合质量的一维，不覆盖功能、UX 与维护 |

## 官方身份边界

[官方仓库](https://github.com/deepseek-ai/deepseek-harness)把 `dsh-plugin` topic 定义为社区发现入口，并明确项目仍处 developer preview、会发生破坏性兼容变更；维护者可自行添加 topic。因此：

- topic 收录只能记 `COMMUNITY_DISCOVERABLE`；
- 作者自称“官方功能/首批内测”只能记 `SELF_CLAIMED`；
- `BETA_PARTICIPANT_VERIFIED` 必须由 DeepSeek 控制的一手页面、仓库、账号或可核验邀请逐仓逐版本点名；
- 身份标签与 Stars 都不进入质量分。

本轮没有找到可核验的“官方认可首批内测插件名单”，所以该 cohort 的结论为 `UNPROVEN`。为避免空跑，样本同时包含官方内置 plan-mode（标尺）、一个“内测来源候选” `plugin-registry`（身份仍为 `UNPROVEN`）和一个作者自称官方功能的 `dsh-TUI`（`SELF_CLAIMED`）。
