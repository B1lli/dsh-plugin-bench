# 国内渠道待发布稿

这些稿件只作待发布准备。本次执行未经用户最终认可，不得点击发布、提交或定时发布。

## 知乎

### 标题

如何判断一个 DSH 插件的质量？我做了一套绑定 commit 的证据评分卡

### 正文

判断插件质量时，最容易拿到的是 Stars、README 和“官方/内测”标签，最难拿到的是能复现的运行证据。前几项适合帮助发现项目，却不足以证明安装、激活、主路径、重启、权限边界和卸载是否真的可用。

我把这个问题做成了一个开源 CLI：DSH Plugin Bench。它不输出脱离版本的单一排名，而是针对确定的 artifact 和 commit，给出质量区间、证据覆盖率和逐项证据账本。

它有几条硬规则：

1. Bundle、原生 Cordis 插件、Skill、Preset 分开判断适用项。
2. PASS、PARTIAL、FAIL、UNPROVEN、N/A 各有不同含义，缺证据不会被当成失败，也不会被归一化掉。
3. 运行证据必须绑定完整 commit、artifact、DSH/Node/OS 和 profile。
4. Stars 和身份标签只作采用度信息，不进入质量分。
5. “官方/内测”没有一方逐仓逐版本证据时保持 UNPROVEN。

首轮 pilot 固定了 11 个样本，覆盖功能结果、安装与卸载、DSH 集成、可靠性、权限与隐私、性能、使用体验、发布维护 8 个维度。只有 1 个样本超过 80% 的正式证据覆盖门槛。这不等于它“最好”，只表示其他样本在负责比较前仍缺少足够的 commit-bound runtime evidence。

项目已经发布 GitHub 源码版，npm 尚未发布。仓库：
https://github.com/B1lli/dsh-plugin-bench

我希望得到的反馈很具体：对于插件维护者，哪些运行证据能稳定在隔离 DSH profile 里复现，哪些检查的成本高于实际价值？

## 掘金

### 标题

开源一个 DSH 插件质量评分器：证据绑定 commit，未知项不硬算分

### 摘要

DSH Plugin Bench 为 Bundle、Cordis 插件、Skill 和 Preset 生成类型感知的质量区间与证据账本，Stars 与身份只展示、不计分。

### 正文结构

1. 事故形状：把 Stars、静态测试文件或仓库标签当成质量证据。
2. 数据模型：artifact + full commit + evaluatedAt + path-scoped commitAt + runtime environment。
3. 状态语义：PASS / PARTIAL / FAIL / UNPROVEN / N/A。
4. 类型感知：Bundle、Cordis、Skill、Preset 的 N/A 与适用项不同。
5. 八维评分与 80% 覆盖门槛。
6. 11 样本 pilot 的边界：覆盖率不等于最好，身份不等于质量。
7. 源码运行与贡献 runtime evidence 的方法。

项目地址：https://github.com/B1lli/dsh-plugin-bench

### 标签

DeepSeek、AI、开源、测试、开发者工具

## 公众号

### 标题

插件质量能不能被证明？一张绑定版本的 DSH 评分卡

### 导语

插件目录解决“去哪找”，Stars 反映“有多少人关注”，但安装、激活、权限边界和真实主路径是否可靠，仍需要另一套证据。DSH Plugin Bench 把这些证据绑定到确定的 artifact 和 commit，并把无法证明的部分明确标成 UNPROVEN。

### 配图

`xhs-cover-2026-08-23.png` 可作为首图；正式排版前需另裁 2.35:1 公众号头图，本轮未发布。
