# DSH Plugin Bench promotion execution — 2026-08-23

This report records actions actually completed on 2026-08-23. A channel is counted as published only when a public URL was verified. Prepared copy is not counted as publication.

## Release snapshot

- Repository: <https://github.com/B1lli/dsh-plugin-bench>
- Release: [v0.2.0](https://github.com/B1lli/dsh-plugin-bench/releases/tag/v0.2.0), published `2026-08-22T23:55:33Z`
- Release commit: `c8923e5edf009c0045cc26d8935e8d34337cd5b9`
- Remote CI at the release commit:
  - [main CI](https://github.com/B1lli/dsh-plugin-bench/actions/runs/32606517115): success
  - [v0.2.0 tag CI](https://github.com/B1lli/dsh-plugin-bench/actions/runs/32606519309): success
- npm status at `2026-08-23T08:23Z`: `npm whoami` returned `ENEEDAUTH`; `npm view dsh-plugin-bench` returned `E404`. The package was not published.

The promotion language describes the project as an independent, evidence-backed, end-to-end, type-aware DSH plugin quality benchmark and scorecard system. Stars and claimed identity are not scored. No official or beta status is asserted without first-party, repository-and-version-specific evidence.

## Actually published overseas

| Channel | Public URL | Published (UTC) | Verified state |
|---|---|---:|---|
| DeepSeek Harness GitHub Discussions — “Show Your Plugins!” | [Discussion #4168](https://github.com/deepseek-ai/deepseek-harness/discussions/4168) | `2026-08-23T07:56:45Z` | Public discussion by `B1lli`; project independence and scoring boundaries disclosed. |
| Reddit `r/DeepSeek` — Resources | [A type-aware scorecard for evaluating DSH plugins](https://www.reddit.com/r/DeepSeek/comments/1vw1h0m/a_typeaware_scorecard_for_evaluating_dsh_plugins/) | `2026-08-23T08:22:11.346Z` | Public post by `u/B1llI_`; visible in the community feed with Resources flair and no removal, filter, or moderation-queue banner at verification time. |
| Awesome DeepSeek Harness directory | [PR #472](https://github.com/0xsline/awesome-deepseek-harness/pull/472) | `2026-08-23T08:22:52Z` | Public bilingual listing PR; OPEN and MERGEABLE at verification time. Inclusion in the main directory remains pending maintainer review. |

### Reddit rule check

`r/DeepSeek` was selected as the single Reddit community. Its live rules require relevance, substantive context, direct source links, non-promotional titles, Resources flair, and a 1-in-10 ceiling for self-promotion. Before posting, the four-year-old account profile showed unrelated prior participation and 32 visible contributions, a community search found no duplicate “plugin quality” discussion, and the post included a maintainer disclosure plus a direct GitHub link. No cross-post or second-subreddit repost was made.

The Reddit post was submitted and publicly verified before the later instruction to stop all browser publishing at the final button. After that instruction arrived, no browser Submit, Post, or Publish action was performed, and the already-public Reddit post was not deleted.

## Overseas blocked or deliberately not submitted

| Channel | Result | Evidence / reason |
|---|---|---|
| Hacker News | `BLOCKED(browser/session)` | The submit route could be opened, but repeated Chrome/in-app-browser DOM and screenshot operations timed out and reset the session. Retrying the same path was stopped. No HN post exists. |
| DEV Community | `BLOCKED(login)` | `https://dev.to/new` showed the “Join the DEV Community” sign-in page. No post was submitted. |
| Hashnode | `BLOCKED(login/security checkpoint)` | `https://hashnode.com/draft/new` redirected to a login callback and displayed a Vercel Security Checkpoint. No post was submitted. |
| npm | `BLOCKED(auth)` | The release evidence is suitable for publication review, but this machine is not authenticated (`ENEEDAUTH`) and the package name is not currently present (`E404`). Quality and account gates were not bypassed. |
| dsh.pub plugin directory | `NOT_SUBMITTED(scope mismatch)` | The directory submission contract is for installable plugin bundles; DSH Plugin Bench is a standalone evaluation tool, so it was not misrepresented as a bundle merely to add a channel. |
| Reddit `r/LocalLLaMA` and other subreddits | `NOT_SUBMITTED(no duplicate promotion)` | One relevant, rules-compatible Reddit community was selected. The same project was not repeated across communities. |

Channel-specific drafts for HN, Reddit, DEV, and Hashnode are saved in [overseas-drafts-2026-08-23.md](./promotion-assets/overseas-drafts-2026-08-23.md). Their presence does not mean those channels were published.

## Domestic channels — publication count: 0

The authorization boundary was observed: no domestic Publish, Submit, or Schedule button was clicked.

| Channel | State | Prepared material / blocker |
|---|---|---|
| Xiaohongshu | `PREPARED; BLOCKED(login/OTP)` | High-quality title, body, tags, and a 3:4 cover are ready. The Creator Center showed the phone/SMS verification login screen, so the form and final publish button could not be reached. No OTP was requested and nothing was published. |
| Zhihu | `PREPARED; BLOCKED(login)` | A channel-specific long-form draft is ready. The write route redirected to the Zhihu sign-in page. Nothing was published. |
| Juejin | `PREPARED; BLOCKED(login/OTP)` | A technical article title, summary, outline, and tags are ready. The editor displayed verification-code login/registration. No OTP was requested and nothing was published. |
| WeChat Official Account | `LOCAL_DRAFT_ONLY` | A title, introduction, and cover direction are prepared; no authenticated editor was operated. Nothing was published or scheduled. |

Domestic assets:

- [Xiaohongshu draft](./promotion-assets/xhs-draft-2026-08-23.md)
- [Xiaohongshu cover](./promotion-assets/xhs-cover-2026-08-23.png)
- [Zhihu, Juejin, and WeChat drafts](./promotion-assets/domestic-drafts-2026-08-23.md)

The selected Xiaohongshu title is “DSH插件质量评分卡开源”. The body passed the local AI-flavor audit with score `0`, findings `0`, blockers `0`. A self-review score is `33/35`: hook 4, usefulness 5, specificity 5, save value 5, trust 5, platform fit 4, privacy 5. The cover uses only the project title, accurate scope language, and the `PASS / UNPROVEN / FAIL / N/A` evidence-status vocabulary; it contains no invented benchmark result or official branding.

No cookies, credentials, OTPs, private browser screenshots, or platform-session data are stored in the repository.

## Follow-up measurements

These are checks to perform after 24 and 72 hours; no result is assumed in advance.

- Record Discussion #4168 reactions, replies, and substantive maintainer feedback.
- Record the Reddit post score, comments, visible moderation status, and referral questions; do not repost if engagement is low.
- Record PR #472 review and merge/close status. Count directory inclusion only after merge.
- Use the repository-owner traffic view to record unique visitors, clones, and referring sites for the same windows; keep private account analytics out of the repository if they expose user data.
- Track issue or discussion links that identify reproducible rubric gaps. Do not substitute Stars, impressions, or claimed identity for quality evidence.
