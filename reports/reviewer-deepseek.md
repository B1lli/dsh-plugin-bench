# DeepSeek Harness agent 独立审核

审核环境：官方 DeepSeek Harness `0.1.0-rc.8`，模型 `deepseek-official/deepseek-v4-flash`，API key 从 macOS Keychain 注入进程环境，未写入项目文件或报告。

最终规则的脱敏 prompt、完整响应和采纳映射见 [`../evidence/reviews/deepseek-final-review-transcript.md`](../evidence/reviews/deepseek-final-review-transcript.md)。

DeepSeek agent 在收到完整候选规则后独立审阅，判断八维权重闭合、证据绑定、身份去偏、安全红线与按类型适用的方向可用于 pilot；同时指出 `UNPROVEN` 上界、39/49 阈值、E 级定义、`N/A` 裁量、80% 覆盖率与 `UNSAFE` 关系需要明确。

这些问题已分别在 README、`rubric.json` 和 runtime 校验器中明确；39/49 与 80% 仍只作为需要继续用真实样本校准的 pilot 阈值。模型审核参与规则审阅，不直接决定项目事实或最终分数。
