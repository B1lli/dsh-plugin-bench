# DeepSeek Harness 独立方法审阅 transcript

- Date: 2026-08-20
- Harness: DeepSeek Harness `0.1.0-rc.8`
- Model: `deepseek-official/deepseek-v4-flash`
- Surface: official `headless` profile
- Credential handling: macOS Keychain → process environment; no credential value persisted
- Tool use: disabled by prompt

## Prompt

> 你是独立评测方法审阅者。只审查以下最终规则是否合理，禁止调用工具，直接给中文结论，控制在800字内：DSH插件评分八维权重为功能20、安装生命周期12、原生集成13、可靠性12、安全隐私15、性能8、UX运维10、测试发布维护10；PASS满分、PARTIAL半分、FAIL零分、UNPROVEN保留上界、N/A只能由评分器按artifact类型决定；覆盖率不足80%不评级；真实功能至少E4、安装至少E3、工程验证至少E2；runtime证据必须绑定完整commit SHA和artifact根；Stars与官方/内测身份不计质量；安装失败上限39、核心功能失败上限49、重大未披露越界为UNSAFE；Bundle/原生插件/Skill/Preset各自适用。请输出：总体判断、优点、仍需警惕、是否可用于pilot。

## Complete response

### 总体判断

规则框架总体合理、可落地：维度完整、权重闭合（八维合计100）、门槛与证据要求方向正确，具备作为pilot评分规范的基础。

### 优点

1. **权重分配务实**：安全隐私15高于平均，符合插件供应链风险现状；功能20为首重，主次得当。
2. **评分标度清晰**：PASS/PARTIAL/FAIL三态加UNPROVEN、N/A两个特殊态，覆盖证据不足与不适用场景，N/A由评分器按artifact类型裁定可防滥用。
3. **证据纪律严格**：runtime证据绑定完整commit SHA与artifact根，是防伪造的关键设计。
4. **去偏设置好**：Stars与官方/内测身份不计质量，避免popularity bias。
5. **安全红线明确**：重大未披露越界直接UNSAFE，兜底有力；失败率上限（安装39%/核心49%）为质量设了量化底线。
6. **分型适用**：Bundle/原生插件/Skill/Preset各自适用，尊重异构性。

### 仍需警惕

1. **UNPROVEN“保留上界”语义危险且含糊**：若指未证实仍按上界计分，等于奖励无证据声明，应改为“按PARTIAL封顶或降档”，需明确释义。
2. **39/49两阈值出处不明**：缺少口径说明（百分比？统计窗口？样本量要求），易被质疑武断，需补充校准依据。
3. **E2/E3/E4等级未在规则内定义**：引用外部等级体系而不内嵌定义，会造成评分器间不一致，需附等级说明。
4. **N/A自由裁量过大**：应加限制条件（如明确列出可判N/A的artifact-维度组合），防止以N/A规避低分。
5. **覆盖率80%一刀切**：对不同artifact类型可考虑差异化，避免小型插件被误杀。
6. **UNSAFE与总分关系未说明**：是否一票否决？需写入规则。

### 是否可用于pilot

**可以**，但建议以“pilot草案”身份运行：先补上UNPROVEN释义、阈值依据、E级定义、N/A白名单四项，再对少量样本双人交叉评分校准一致性，随后即可正式启用。

## Disposition

- 已明确：`UNPROVEN` 不增加确认分，只形成理论上界；coverage 低于门槛不评级。
- 已明确：E0–E5 定义内嵌于 `rubric.json` 和 README。
- 已执行：runtime 禁止提交 `N/A`；适用性只由评分器生成。
- 已明确：`UNSAFE` 不进入普通等级。
- 保留为 pilot 校准项：39/49 与 80% 是首轮治理阈值，需随更多真实样本做版本化校准，不能宣称统计最优。
