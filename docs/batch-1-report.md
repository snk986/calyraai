# 批次 1 汇总报告：优化现有页面

## 一、修改文件清单

| 任务 | 文件 | 改动 |
|---|---|---|
| 任务3 | `messages/en.json` | 首页 FAQ 7→11 条，删除含糊措辞，写真实免费额度 |
| 任务3 | `messages/{es,pt,ja,ko,zh-CN}.json` | 补 q8–q11 英文占位 |
| 任务3 | `app/[locale]/page.tsx` | faqItems 数组扩到 q11 |
| 任务4 | `messages/en.json` | 首页 pricingPreview + pricing 页 freeCard/subscriptions 写真实额度与差异 |
| 任务5 | `app/[locale]/page.tsx` | 删除 `portraitAvatarUrl` 函数与 `avatarUrl` 字段 |
| 任务5 | `components/home/music-gallery.tsx` | 头像改首字母占位；封面 alt 含 genre；加懒加载+宽高 |
| 任务6 | `app/[locale]/page.tsx` | Popular Styles 卡片加 href，lyrics/text 分流 |
| 任务6 | `app/[locale]/song/[id]/page.tsx` | title 格式优化为 `{title} - {genre} AI Song | Calyra AI` |
| 任务6 | `components/song-maker/song-maker-route-page.tsx` | "learn more" → "Learn about Calyra AI" |

提交（4 个独立 commit）：
1. `773e831` 重写首页 FAQ
2. `b29e849` 定价区真实额度与付费差异
3. `60ac471` 去掉 pravatar 头像 + 封面 alt
4. `af6351a` 技术 SEO 修复

## 二、第 0 步：任务 2 验收输出

### 首页标题树（渲染后 HTML）

- **h1**（唯一）：AI Song Maker & Music Generator
- h2：Ready lyric ideas for your next song. / Discover Music Made with Calyra AI / Create Songs in Popular AI Music Styles / **Why Choose Calyra AI Song Maker** / Make AI Music in 3 Simple Steps with Calyra AI / **AI Music for YouTube, TikTok, Podcasts and Games** / Royalty-Free AI Music for Creators / Start Free, Upgrade When You Need More Songs / Questions Before You Generate（+ footer 的 Product/Company/Legal/Contact 等 h3）
- 每区块一个 H2、卡片 H3，全页唯一 H1，无跳级 ✅

### 内链清单（链接文字 → 目标）

- Learn about Calyra → `/about`
- Try the AI song maker → `/ai-song-maker`
- View creator pricing → `/pricing`
- See commercial plans → `/pricing`
- Terms → `/terms`
- Read FAQ → `#faq`
- 导航/工具页/歌曲页/footer 内链均正常

### 任务 2 中被判定"与产品不符"的句子

**无。** 任务 2 提供的英文文案逐条核实后全部与产品实际行为一致（公开歌曲页、封面图、Version A/B 多版本对比、付费下载均真实存在），未删改任何一句。

## 三、任务 6 检查表

### sitemap.xml / robots.txt
- ✅ `/sitemap.xml` 存在，包含：首页、/about、全部 SEO 工具页（ai-song-maker / ai-text-to-song / ai-lyrics-to-song / ai-lyrics-generator / ai-birthday-song-generator / royalty-free / world-cup）、/free-ai-lyrics-generator、/pricing、/blog、全部 blog 文章、/song/{id}（仅公开且达标的歌曲）。
- ✅ URL 为绝对地址，域名 `https://calyraai.com`（`baseUrl` 默认值）。
- ✅ `/robots.txt` 声明 sitemap，disallow `/api/`、`/dashboard`、`/report`，未屏蔽重要页面。
- ⚠️ `/auth` 目录存在（`app/auth/callback`），callback 本身无需索引；账户相关页（dashboard/sign-in 等）为动态路由，非默认语言已 noindex（layout.tsx），默认语言账户页依赖 Supabase 鉴权重定向，未发现误索引。

### 各可索引页面 title / description / canonical / H1

| 页面 | title | 唯一 H1 | canonical | 说明 |
|---|---|---|---|---|
| 首页 `/` | AI Song Maker: Turn Text or Lyrics into Songs \| Calyra AI | ✅ | 自指向 | ✅ |
| /ai-song-maker | AI Song Maker - Create AI Songs Online | ✅ | 自指向 | ✅ |
| /ai-text-to-song | AI Text to Song Generator | ✅ | 自指向 | ✅ |
| /ai-lyrics-to-song | AI Lyrics to Song Generator | ✅ | 自指向 | ✅ |
| /ai-lyrics-generator | AI Lyrics Generator | ✅ | 自指向 | ✅ |
| /ai-birthday-song-generator | Free AI Birthday Song Generator | ✅ | 自指向 | ✅ |
| /royalty-free-ai-music-generator | Royalty-Free AI Music Generator | ✅ | 自指向 | ✅ |
| /world-cup-song-generator | World Cup Song Generator | ✅ | 自指向 | ✅ |
| /about | About Calyra AI | ✅ | 自指向 | ✅ |
| /pricing | Calyra AI Pricing | ✅ | 自指向 | ✅ |
| /blog | Calyra AI Blog（含文章页） | ✅ | 自指向 | ✅ |
| /song/{id} | `{title} - {genre} AI Song \| Calyra AI`（已优化） | ✅（歌曲标题） | 自指向 | 仅公开达标歌曲 index |

所有页面 title、description 唯一；canonical 自指向；H1 唯一。

### Popular Styles 内链分流
- "Lyrics to Song AI" → `/ai-lyrics-to-song`（已改）
- "Text to Song AI" → `/ai-text-to-song`（已改）
- 其余 6 张保持 `/ai-song-maker`（批次 2 处理）

## 四、Lighthouse 数据（移动端）

| 页面 | Performance | SEO | LCP | CLS | FCP |
|---|---|---|---|---|---|
| 首页 `/` | 78 | 100 | 3.9s | 0 | 3.9s |
| /ai-song-maker | 68 | 92 | 5.1s | 0 | 5.1s |

**已直接修复的问题：**
- 画廊封面图补 `width/height` + `loading="lazy"` + `decoding="async"`（修复 offscreen-images / 尺寸问题）
- "learn more" 链接 → "Learn about Calyra AI"（修复 SEO 扣分项 link-text）

**仅汇报、未改（需架构/资源层面处理）：**
- `server-response-time`：两页均为动态渲染（首页查 Supabase、工具页查 entitlements），是 LCP 偏高的主因。
- 其余：`unminified-javascript`、`unused-css/js`、`modern-image-formats`（封面图非 WebP）、`total-byte-weight`、`uses-long-cache-ttl` 等为通用优化项，未在本批次处理。

## 五、待确认清单

1. **"每日免费生成"文案与代码不符**：`/pricing` 页 FAQ（q5）写"1-2 free generations every 24 hours"，但代码里免费额度是**注册 welcome bonus 300 credits（=3 首）**，无每日免费机制。此文案已过时，建议后续修正（本次未动 pricing 页 FAQ，任务范围外）。
2. **"免费仅限个人非商用"条款不存在**：`/terms` 未明确区分免费/付费商用范围，仅写"可对账户生成内容使用输出"。实际商用门槛来自"下载=付费专属"（free 返回 402）。因此任务 4 未写"免费非商用"这句话，改为陈述"付费档含 MP3 下载+商用"这一代码事实。
3. **歌曲时长/格式/语言**：代码中音频 provider 未配置明确时长（`duration` 返回 0）、仅确认下载格式为 `.mp3`、支持 `instrumental` 与 vocals，但**具体歌曲时长、除 mp3 外的格式、支持语言**均查不到，FAQ 未写入这几项。
4. **About 页运营主体**：About 页只写产品理念，**没有**公司名、注册地址等运营主体信息（影响 E-E-A-T / 信任，建议后续补充）。
5. **producer reports 权益**：Basic/Pro 订阅均含 producer reports（`reportCreditsIncluded: true`），本批次因订阅卡 3 条 feature 槽位限制，改为突出"下载+商用"共性，producer reports 在 credit packs 区仍有展示，未丢失但未在订阅卡重复。

## 六、构建结果

✅ **`next build` 通过**，完整输出路由清单，无编译错误、无类型错误。中途曾因环境 `genie-trash` 安全删除机制超时，清理 `.next` 后正常。
