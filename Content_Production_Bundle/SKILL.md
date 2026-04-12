---
name: content_production-bundle
description: Combined Content_Production skills for Manus AI
---

## Content_Production Super-Skill Bundle

### Skill: write


## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `audit` | Audit content quality against copywriting, SEO, and platform standards | `references/audit.md` |
| `blog` | 💡💡 Create SEO-optimized blog content | `references/blog.md` |
| `blog-youtube` | 💡💡 Generate SEO-optimized blog article from YouTube video | `references/blog-youtube.md` |
| `cro` | Analyze the current content and optimize for conversion | `references/cro.md` |
| `enhance` | Analyze the current copy issues and enhance it | `references/enhance.md` |
| `fast` | Write creative & smart copy [FAST] | `references/fast.md` |
| `formula` | Generate copy using proven copywriting formulas (AIDA, PAS, BAB, etc.) | `references/formula.md` |
| `good` | Write good creative & smart copy [GOOD] | `references/good.md` |
| `publish` | Audit content, auto-fix issues, output publish-ready version | `references/publish.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
---
### Skill: youtube


# YouTube

YouTube video content repurposing and VidCap.xyz API integration.

<args>$ARGUMENTS</args>

## When to Use

- Convert YouTube videos to blog posts, infographics, social content
- Download video/audio from YouTube
- Extract captions and transcripts
- Generate AI summaries of video content
- Analyze video comments

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `blog` | Convert YouTube video to SEO-optimized blog post | `references/blog.md` |
| `infographic` | Convert YouTube video to visual infographic | `references/infographic.md` |
| `social` | Convert YouTube video to multi-platform social posts | `references/social.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| VidCap Content API | `references/api-content.md` |
| VidCap Media API | `references/api-media.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/vidcap.py` | VidCap.xyz API client (download, captions, summaries) |
| `scripts/test_vidcap.py` | VidCap API test suite |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments

---
### Skill: media-processing


# Media Processing Skill

Process video, audio, and images using FFmpeg, ImageMagick, and RMBG CLI tools.

## Tool Selection

| Task | Tool | Reason |
|------|------|--------|
| Video encoding/conversion | FFmpeg | Native codec support, streaming |
| Audio extraction/conversion | FFmpeg | Direct stream manipulation |
| Image resize/effects | ImageMagick | Optimized for still images |
| Background removal | RMBG | AI-powered, local processing |
| Batch images | ImageMagick | mogrify for in-place edits |
| Video thumbnails | FFmpeg | Frame extraction built-in |
| GIF creation | FFmpeg/ImageMagick | FFmpeg for video, ImageMagick for images |

## Installation

```bash
# macOS
brew install ffmpeg imagemagick
npm install -g rmbg-cli

# Ubuntu/Debian
sudo apt-get install ffmpeg imagemagick
npm install -g rmbg-cli

# Verify
ffmpeg -version && magick -version && rmbg --version
```

## Essential Commands

```bash
# Video: Convert/re-encode
ffmpeg -i input.mkv -c copy output.mp4
ffmpeg -i input.avi -c:v libx264 -crf 22 -c:a aac output.mp4

# Video: Extract audio
ffmpeg -i video.mp4 -vn -c:a copy audio.m4a

# Image: Convert/resize
magick input.png output.jpg
magick input.jpg -resize 800x600 output.jpg

# Image: Batch resize
mogrify -resize 800x -quality 85 *.jpg

# Background removal
rmbg input.jpg                          # Basic (modnet)
rmbg input.jpg -m briaai -o output.png  # High quality
rmbg input.jpg -m u2netp -o output.png  # Fast
```

## Key Parameters

**FFmpeg:**
- `-c:v libx264` - H.264 codec
- `-crf 22` - Quality (0-51, lower=better)
- `-preset slow` - Speed/compression balance
- `-c:a aac` - Audio codec

**ImageMagick:**
- `800x600` - Fit within (maintains aspect)
- `800x600^` - Fill (may crop)
- `-quality 85` - JPEG quality
- `-strip` - Remove metadata

**RMBG:**
- `-m briaai` - High quality model
- `-m u2netp` - Fast model
- `-r 4096` - Max resolution

## References

Detailed guides in `references/`:
- `ffmpeg-encoding.md` - Codecs, quality, hardware acceleration
- `ffmpeg-streaming.md` - HLS/DASH, live streaming
- `ffmpeg-filters.md` - Filters, complex filtergraphs
- `imagemagick-editing.md` - Effects, transformations
- `imagemagick-batch.md` - Batch processing, parallel ops
- `rmbg-background-removal.md` - AI models, CLI usage
- `common-workflows.md` - Video optimization, responsive images, GIF creation
- `troubleshooting.md` - Error fixes, performance tips
- `format-compatibility.md` - Format support, codec recommendations

---
### Skill: assets-organizing


# Assets Organizing

Standardize asset output locations, naming conventions, and directory structures for all marketing outputs.

## When to Use

Use this skill when:
- Creating content that needs file output (articles, videos, designs)
- Generating AI assets (images, storyboards, scripts)
- Organizing existing assets
- Determining output paths for new content types

## Quick Reference

### Output Paths

| Asset Type | Path | Naming |
|------------|------|--------|
| Articles | `assets/articles/{date}-{slug}/` | `{slug}.md` + `images/{date}-{slug}/` |
| Storyboards | `assets/storyboards/{date}-{slug}/` | `storyboard.md` + `scene-{N}-*.png` |
| Videos | `assets/videos/{date}-{slug}/` | `master.mp4` + `scene-{N}.mp4` |
| Transcripts | `assets/transcripts/` | `{slug}.md` |
| Writing Styles | `assets/writing-styles/` | `{slug}.md` |
| Banners | `assets/banners/{campaign}/` | `{variant}-{size}.{ext}` |
| Designs | `assets/designs/{project}/` | `{type}-{variant}.{ext}` |
| Infographics | `assets/infographics/` | `{date}-{slug}.{ext}` |
| Logos | `assets/logos/` | `{name}-{variant}.{ext}` |
| Social Posts | `assets/posts/{platform}/` | `{date}-{slug}.{ext}` |
| Generated | `assets/generated/{type}/` | `{date}-{slug}.{ext}` |
| **Reports** | | |
| Analytics | `assets/reports/analytics/` | `{date}-{report-type}.md` |
| SEO | `assets/reports/seo/` | `{date}-{audit-type}.md` |
| Social | `assets/reports/social/` | `{date}-{platform}-{report-type}.md` |
| Campaign | `assets/reports/campaigns/` | `{date}-{campaign}-{report-type}.md` |
| Performance | `assets/reports/performance/` | `{date}-{channel}-report.md` |
| Ads | `assets/reports/ads/` | `{date}-{platform}-report.md` |
| Email | `assets/reports/email/` | `{date}-{campaign}-report.md` |
| Funnel | `assets/reports/funnels/` | `{date}-{funnel}-analysis.md` |
| Content | `assets/reports/content/` | `{date}-{content-type}-audit.md` |
| **Text Content** | | |
| Copy | `assets/copy/{type}/` | `{date}-{slug}.md` |
| Ad Copy | `assets/copy/ads/` | `{date}-{campaign}-{variant}.md` |
| Email Copy | `assets/copy/emails/` | `{date}-{sequence}-{slug}.md` |
| Landing Pages | `assets/copy/landing-pages/` | `{slug}.md` |
| Headlines | `assets/copy/headlines/` | `{date}-{topic}.md` |
| Scripts | `assets/scripts/{type}/` | `{slug}.md` |
| **Campaigns** | | |
| Campaign Briefs | `assets/campaigns/{date}-{slug}/briefs/` | `{type}-brief.md` |
| Campaign Creatives | `assets/campaigns/{date}-{slug}/creatives/` | `{channel}-{variant}.{ext}` |
| Campaign Reports | `assets/campaigns/{date}-{slug}/reports/` | `{date}-{report-type}.md` |
| Campaign Assets | `assets/campaigns/{date}-{slug}/assets/` | `{type}-{name}.{ext}` |
| **Sales** | | |
| Pitches | `assets/sales/pitches/` | `{date}-{industry}-{persona}.md` |
| Proposals | `assets/sales/proposals/` | `{date}-{client}-proposal.md` |
| Case Studies | `assets/sales/case-studies/` | `{date}-{client}-{outcome}.md` |
| Battlecards | `assets/sales/battlecards/` | `{competitor}.md` |
| **SEO** | | |
| SEO Audits | `assets/seo/audits/` | `{date}-{domain}-audit.md` |
| Keyword Research | `assets/seo/keywords/` | `{date}-{topic}-keywords.md` |
| Schema Markup | `assets/seo/schemas/` | `{page}-schema.json` |
| **Funnels** | | |
| Funnel Designs | `assets/funnels/designs/` | `{date}-{slug}-funnel.md` |
| Funnel Audits | `assets/funnels/audits/` | `{date}-{funnel}-audit.md` |
| A/B Tests | `assets/funnels/tests/` | `{date}-{test-name}.md` |
| **Leads** | | |
| Scoring Models | `assets/leads/scoring-models/` | `{date}-{model-name}.md` |
| Segments | `assets/leads/segments/` | `{segment-name}.md` |
| ICP Profiles | `assets/leads/icp-profiles/` | `{persona}.md` |
| **Community** | | |
| Response Templates | `assets/community/templates/` | `{situation}.md` |
| FAQs | `assets/community/faqs/` | `{topic}.md` |
| Moderation Guides | `assets/community/moderation/` | `{policy}.md` |
| **Retention** | | |
| Retention Campaigns | `assets/retention/campaigns/` | `{date}-{campaign}.md` |
| Health Scoring | `assets/retention/scoring-models/` | `{date}-{model}.md` |
| Intervention Playbooks | `assets/retention/playbooks/` | `{segment}.md` |
| **Attraction** | | |
| Landing Page Content | `assets/attraction/landing-pages/` | `{slug}.md` |
| Lead Magnets | `assets/attraction/lead-magnets/` | `{slug}.md` |
| pSEO Templates | `assets/attraction/pseo-templates/` | `{template-name}.md` |
| Content Briefs | `assets/attraction/content-briefs/` | `{date}-{topic}.md` |
| **Diagnostics** | | |
| Campaign Audits | `assets/diagnostics/campaign-audits/` | `{date}-{campaign}.md` |
| Content Reviews | `assets/diagnostics/content-reviews/` | `{date}-{content}.md` |

### Naming Conventions

Load: `references/naming-conventions.md`

### Directory Structure Rules

Load: `references/directory-structure.md`

### Asset Type Details

Load: `references/asset-types.md`

## Core Rules

1. **Always use kebab-case** for slugs and filenames
2. **Date prefix** for time-sensitive assets: `{YYMMDD}` or `{YYMMDD-HHmm}`
3. **Self-contained folders** for multi-file assets (articles, videos, storyboards)
4. **Flat files** for single-file assets (transcripts, writing-styles)
5. **Platform subfolders** for platform-specific content

## Date Format

Use `$CK_PLAN_DATE_FORMAT` env var or default to `YYMMDD-HHmm`.

```bash
# PowerShell
Get-Date -UFormat "%y%m%d-%H%M"

# Bash
date +%y%m%d-%H%M
```

## Pre-Output Checklist

Before writing any asset:
1. Determine asset type → get base path
2. Generate slug from topic/title
3. Check if folder/file exists (avoid overwrite)
4. Create directory structure if needed
5. Output all related files together

## Integration Points

This skill integrates with:
- `/video:create` - Video assets
- `/video:storyboard:create` - Storyboard assets
- `/content/blog` - Article assets
- `/campaign` commands - Campaign assets
- `content-creator` agent - Various content
- `ui-ux-designer` agent - Design assets
- `copywriter` agent - Copy assets
- `email-wizard` agent - Email copy
- `social-media-manager` agent - Social posts
- `campaign-manager` agent - Campaign assets
- `sale-enabler` agent - Sales assets
- `seo-specialist` agent - SEO assets
- `/seo` commands - SEO audits
- `funnel-architect` agent - Funnel assets
- `lead-qualifier` agent - Lead assets
- `community-manager` agent - Community assets
- `continuity-specialist` agent - Retention assets
- `attraction-specialist` agent - Attraction assets
- `campaign-debugger` agent - Diagnostic reports
- `content-reviewer` agent - Review reports
- `analytics` skill - Analytics reports
- `seo` skill - SEO reports
- `social` skill - Social reports
- `campaign` skill - Campaign reports
- `ads-management` skill - Ads reports
- `email` skill - Email reports

---
### Skill: storage


# Storage Skill

S3-compatible object storage integration for marketing assets. Works with Cloudflare R2, AWS S3, MinIO, Backblaze B2, DigitalOcean Spaces.

## When to Use

- Upload generated assets (images, videos, slides) to cloud storage
- Sync local asset folders to remote bucket
- Get public URLs for sharing/embedding
- List remote assets

## Configuration

Required env vars in user's `.env`:
```bash
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=xxxxx
S3_SECRET_ACCESS_KEY=xxxxx
S3_BUCKET=my-assets
S3_REGION=auto                        # optional, default: auto
S3_PUBLIC_URL=https://cdn.example.com # optional, custom domain
```

## Scripts

### s3-client.cjs
S3-compatible client for storage operations.

```javascript
const s3 = require('./scripts/s3-client.cjs');

// Check if configured
if (!s3.isConfigured()) {
  console.log('S3 not configured, using local storage only');
}

// Upload
const result = await s3.upload('./assets/image.png', 'designs/image.png');
// { success: true, url: 'https://...' }

// Download
await s3.download('designs/image.png', './local/image.png');

// List
const { objects } = await s3.list('designs/');

// Get URL
const url = s3.getPublicUrl('designs/image.png');

// Delete
await s3.remove('designs/old-image.png');
```

## Fallback Behavior

If S3 not configured:
- `isConfigured()` returns `false`
- All operations return graceful errors
- No exceptions thrown
- Commands output local paths only

## Provider Examples

| Provider | Endpoint |
|----------|----------|
| Cloudflare R2 | `https://<account>.r2.cloudflarestorage.com` |
| AWS S3 | `https://s3.<region>.amazonaws.com` |
| MinIO | `http://localhost:9000` |
| Backblaze B2 | `https://s3.<region>.backblazeb2.com` |
| DigitalOcean | `https://<region>.digitaloceanspaces.com` |

## Installation

Install AWS SDK in your project root (required for S3 operations):
```bash
npm install @aws-sdk/client-s3
```

Without SDK installed, all operations gracefully return `{success: false, error: 'S3 not configured'}`.

## Security

- Credentials only in `.env` (gitignored)
- Never logged or exposed
- Use bucket-scoped tokens (least privilege)

---
### Skill: ckm-storage


## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `list` | list | `references/list.md` |
| `sync` | sync | `references/sync.md` |
| `upload` | upload | `references/upload.md` |
| `url` | url | `references/url.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
---
