# Independent GPT rubric review transcript

- reviewer: independent GPT sub-agent
- date: 2026-08-20

## Received review task

独立审核任务：针对“DeepSeek Harness 第三方插件综合质量评分”设计一套尽可能全面、可复现、证据化且不过度防御的评分维度。请先独立调研官方 DeepSeek Harness 插件架构、安装/测试/兼容性要求和现有目录/评分项目，再提出：一级维度、权重、硬门槛、证据等级、对不同类型插件如何避免错罚、热门度如何与质量分离、实际运行评估的最小矩阵。重点审查是否存在现成的同类综合评分系统，以及官方/首批内测认可身份应该如何准确界定。只读，不要改共享文件。最终给我一份可直接合并的审阅意见和来源链接。

## Original response to the main agent

以下是可直接合并的独立 GPT 审阅意见。

## 一、生态空缺判断

结论不是“完全没有同类项目”，而是：

> 截至 2026-08-20，在公开可检索范围内，已有 DSH 插件目录、安装验证、星标排行榜、人工 Verified 标签和安全专项审计；但尚未发现一套同时覆盖真实功能效果、DSH 原生生命周期、可靠性、安全隐私、效率、用户体验和维护证据，并针对不同插件类型校准的综合质量评分。

因此建议定位为：

> DeepSeek Harness 首批证据化、端到端、类型感知的第三方插件综合质量评分体系。

不要宣传“首个 DSH 插件榜单”，因为 [DSH Plugin Leaderboard](https://dshpluginleaderboard.com/) 已经存在。它的边界很明确：

- CI 检查 `dsh.bundle.patch`，并在隔离 profile 执行安装命令。
- 只有安装成功的仓库才入榜。
- 最终排序依据是 GitHub stars。
- 页面明确说，安装验证只证明 manifest/安装，不证明安全。
- 一个仓库无论包含多少 bundle 都只占一个名次。

其他已有项目也大多只覆盖局部：

- [DSH Directory](https://dsh.directory/about) 明确“signals are shown, not scored”，不生成质量、安全、信任或兼容性综合分。
- [DeepSeek Harness Plugins](https://deepseek-harness-plugin.com/about/) 提供人工 Verified/Reviewed，但声明自己是非官方目录，Verified 也不是综合认证。
- [第三方插件安全审计](https://github.com/deepseek-ai/deepseek-harness/discussions/454) 很扎实，但评估对象主要是 DSH 插件信任模型，不是逐个插件的综合质量。
- [OpenSSF Scorecard](https://github.com/ossf/scorecard) 可作为供应链安全子项数据源，但不能代替插件功能和 DSH 集成质量评估。

## 二、建议的 100 分评分框架

| 一级维度 | 权重 | 核心问题 |
|---|---:|---|
| 功能价值与结果正确性 | 20 | 是否真正兑现 README 的核心承诺，最终世界状态/用户产物是否正确 |
| 安装、激活、升级与卸载 | 12 | 文档命令能否在干净 profile 中完成 add、启动、重启生效、升级和 remove |
| DSH 原生集成与可组合性 | 13 | 是否使用公开 seam、正确声明依赖、支持卸载/HMR，不靠加载顺序或遗留核心补丁 |
| 可靠性与状态完整性 | 12 | 错误、取消、重启、部分失败后是否清楚、可恢复、不损坏状态 |
| 权限、安全与隐私 | 15 | 实际权限是否匹配承诺，网络、凭证、遥测和写入行为是否披露并受控 |
| 性能与资源效率 | 8 | 空闲开销、启动开销、热路径延迟、token/内存/网络增量是否与收益相称 |
| 用户体验与可运维性 | 10 | 配置、反馈、错误提示、可见兑现、兼容说明、UI/无障碍是否可用 |
| 测试、发布与维护质量 | 10 | 是否有真实入口测试、回归测试、版本化发布、许可证、变更和支持入口 |

推荐二级评分方式：

- `PASS`：拿满该项。
- `PARTIAL`：拿一半。
- `FAIL`：0 分，并记录可复现失败。
- `UNPROVEN`：不当作失败，单列未知分值。

最终不要只输出一个看似精确的数字，而应输出：

> 已确认 74 分，另有 12 分 UNPROVEN，合理区间 `[74, 86]`，证据覆盖率 88%。

只有证据覆盖率达到 80%，且通过硬门槛，才给正式等级；否则标“暂定/未排名”。

建议等级：

- 90–100：卓越
- 80–89：强推荐
- 70–79：可用，有明确取舍
- 60–69：能力有限或风险较多
- <60：不推荐
- `UNSAFE`：不进入普通等级排序

## 三、硬门槛

1. **插件身份门槛**
   必须能证明是一个真实 DSH bundle、插件包、客户端插件，或使用官方公开扩展 seam 的集成。只有 `dsh-plugin` topic、仓库名或 README 自称不够。

2. **固定评估对象**
   必须记录仓库、commit SHA、包版本、安装路径、DSH 版本、Node/OS/profile。不能给“一个持续变化的 main 分支”打永久分。

3. **安装和启动门槛**
   在其明确支持的平台和 DSH 版本上，官方文档命令无法完成干净安装与启动，则记 `FAIL`，总分最高 39。
   缺少外部 API key、硬件或账号时应记 `UNPROVEN`，不能误判失败。

4. **核心承诺门槛**
   插件能加载但核心功能无可见效果，或结果与宣称相反，总分最高 49。

5. **重大未披露行为门槛**
   受支持用户路径中出现未披露的数据外传、凭证泄漏、破坏性越界写入或绕过用户确认的重大动作，记 `UNSAFE`，不推荐安装。

6. **证据门槛**
   证据覆盖率低于 80% 不给正式排名，只公布暂定区间。

这里不应把“插件与 dsh 进程拥有相同主机权限”本身扣成零分，因为这是当前插件模型的架构事实。应检查插件的实际行为是否超出自己的产品承诺和支持用法。

## 四、证据等级

| 等级 | 含义 |
|---|---|
| E0 | 作者宣传、README 口号，未核实 |
| E1 | 固定 SHA 下的 manifest、源码、文档、许可证等静态证据 |
| E2 | 可复现 build/typecheck/unit/static scan 结果 |
| E3 | 隔离 `DSH_HOME` 中完成安装、配置、启动、重启和卸载 |
| E4 | 真实用户路径运行，并从文件、UI、会话日志、外部系统或最终产物验证结果 |
| E5 | 独立审核者在另一环境、版本或模型条件下复现 |

规则：

- 功能效果不能只靠 E1/E2 拿满，至少需要 E4。
- “独立验证”是证据置信度，不额外给质量加分。
- 作者自己的测试可进入“工程质量”维度，但不能替代评测方的真实运行。
- DSH 官方测试政策同样强调真实组合、发布产物、浏览器快照、真实 API，以及“验证世界状态而不是 Agent 自报成功”。见 [官方测试策略](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/testing.md)。

## 五、不同插件类型如何避免错罚

统一 100 分框架不变，但二级检查按类型解释：

- **工具/MCP 插件**：schema 是否准确、错误是否结构化、取消/超时、真实副作用、权限和结果证据。
- **模型/provider 插件**：请求映射、流式输出、取消、usage、凭证、错误协议和真实 API。
- **记忆/上下文插件**：召回是否真正被使用、项目/用户隔离、重启持久化、删除导出、注入 token 成本。
- **UI/主题插件**：桌面与移动、核心交互、无障碍、CSS 隔离、HMR/卸载清理、渲染性能。
- **工作流/多 Agent 插件**：任务身份、依赖、取消、恢复、幂等性、并发上限和状态可见性。
- **Skill/提示词插件**：发现与激活、指令质量、引用资源、上下文成本、冲突行为；纯文本 skill 不强制做凭证或网络测试。
- **沙箱/执行器插件**：只测试文档支持的文件、环境变量、网络、进程能力；不为不可达的冷门攻击面制造扣分。
- **存储/会话插件**：持久化、重启、回放、版本、部分写入和作用域隔离。
- **连接器插件**：认证、限流、失败语义、同步方向、重复提交和用户确认。

`N/A` 不能当 0 分；在同一一级维度内按适用子项归一化。明确不支持的平台也不扣分，但必须披露。新插件不因 star 少、历史短而自动低分。

官方生命周期要求也应进入评分：Cordis 插件可能因配置修改、HMR、显式 disposal 或服务丢失而卸载，非 Cordis 管理的 timer、watcher、连接等应放入 `ctx.effect()` 并提供 disposer。见 [官方生命周期文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/02-lifecycle-and-effects.md)。

## 六、热门度与质量必须彻底分离

质量总分中不要包含：

- GitHub stars、forks
- 社媒热度
- 仓库年龄
- 是否“首发”
- 目录排名
- 官方/内测身份

另建“采用与传播信号”面板：

- stars、forks、contributors
- npm 下载量
- release 数量
- issue 响应
- 最近维护时间
- 插件自身下载量，而不是其所依附大型母仓库的 stars

现有 leaderboard 会把大型项目后来增加的一个 DSH bundle 的全部仓库 stars 算给插件，这适合作为曝光度，不适合作为插件质量。

热门和冷门项目抽样时，应做同能力配对，例如同为 memory、UI、tool 或 workflow：

- 2 个高热度
- 2 个中等热度
- 2 个 0–9 stars 冷门项目
- 至少一对“功能近似、热度差异大”的项目
- 至少一对“官方/内测声称 vs 普通社区”的同类项目

评分者在完成功能评估前最好隐藏 stars，防止光环偏差。

## 七、最小实际运行矩阵

每个候选至少执行：

1. 固定 SHA、版本、DSH 版本、Node、OS、profile。
2. 独立临时 `DSH_HOME`。
3. 按 README 的精确命令安装。
4. `--dump-config` 确认 bundle 层，但不能把它当成启动成功。
5. 重启 profile，确认插件真实激活。
6. 一个核心 happy path。
7. 一个文档支持范围内的无效配置或依赖不可用路径。
8. 检查用户可见结果以及文件/UI/日志/外部状态。
9. 若支持，修改配置验证 HMR 和旧资源释放。
10. 重启验证必要状态是否持续。
11. remove 后再次启动，确认依赖和 bundle 层消失，且不遗留插件自建进程、监听器或临时资源。
12. 与官方 baseline 共存；只有插件声称可与同类组合时，才追加一个同 seam 插件的共存测试。
13. 记录相对 baseline 的冷启动、空闲 60 秒和一次主路径资源增量。
14. UI 插件追加桌面和移动视口。
15. 模型相关插件使用固定模型、提示、预算；keyless replay 验证管道，再用一个真实 provider 验证结果。
16. 随机/模型依赖行为每个条件至少跑 5 次，报告完整分母；5 次只是 pilot，不能包装成稳定统计结论。

官方安装协议要求 bundle 在 `package.json` 声明 `dsh.bundle.patch`；`dsh plugin add` 安装后需要重启才改变运行中的 bundle 集合；Git 源码安装可能触发 `prepare`，pnpm 会要求用户明确允许 build。见：

- [插件打包与安装教程](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)
- [CLI 与插件管理参考](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md)

本地当前官方 checkout 已是 `0.1.0-rc.8`、commit `141eb6fef83422698aef7a981029e843e8161534`；旧目录大量仍按 `rc.6` 标“已验证”。评估必须把“在 rc.6 通过”和“在当前 rc.8 通过”拆开，不能沿用旧徽章。

## 八、官方与“首批内测”身份如何界定

建议单独显示身份标签，绝不计入质量分：

- `OFFICIAL_BUILT_IN`：位于 `deepseek-ai/deepseek-harness`，或由 DeepSeek 官方 `@deepseek-ai/dsh-*` 发布。
- `OFFICIAL_DOC_REFERENCE`：被官方文档明确用作安装或开发示例。它只表示“被引用”，不表示质量认证。
- `BETA_PARTICIPANT_VERIFIED`：DeepSeek 控制的页面、仓库、账号、邮件或邀请材料明确点名 owner/repo/版本。
- `COMMUNITY_DISCOVERABLE`：添加了官方建议的 `dsh-plugin` topic，或进入社区目录。
- `SELF_CLAIMED`：仅第三方 README 写“官方”“首批”“认可”。

官方首页把 GitHub `dsh-plugin` topic 链接为“Community plugins”，官方 README 也只是建议添加 topic 便于发现；topic 可由仓库维护者自行添加，不能据此推导官方认可。见：

- [DeepSeek Harness 官方首页](https://deepseek.com/harness/en/)
- [官方仓库 README](https://github.com/deepseek-ai/deepseek-harness)
- [GitHub dsh-plugin topic](https://github.com/topics/dsh-plugin)

同样，官方 CLI 文档使用 `deepseek-harness/turtle-ui` 作为命令示例，只能标 `OFFICIAL_DOC_REFERENCE`，除非另有 DeepSeek 主体声明其官方所有权或审核状态。

如果“首批内测插件”名单来自非公开沟通，可以标记“用户提供材料已核对”，但不应在公开榜单上写成“公开官方认证”，除非有可公开引用的一手来源。

## 九、最终审阅判断

这套项目值得立即做，但生态位需要收窄并说准：

- `PASS`：综合质量评分的生态空缺真实存在。
- `FAIL`：“此前完全没有排行榜/评分项目”的说法不成立。
- `UNPROVEN`：当前尚无公开一手证据证明某一批第三方仓库属于“DeepSeek 官方认可首批内测插件”；必须逐个核实。
- 最有传播力的差异点不是再做一个 stars 榜，而是公布固定 SHA、真实运行证据、分项 `PASS/FAIL/UNPROVEN`、质量区间和可复现实验包。

<oai-mem-citation>
<citation_entries>
MEMORY.md:332-352|note=[Used prior DSH installation context and rechecked the current release]
</citation_entries>
<rollout_ids>
01a01943-6343-79a3-a41e-895e2ee7e20c
</rollout_ids>
</oai-mem-citation>
