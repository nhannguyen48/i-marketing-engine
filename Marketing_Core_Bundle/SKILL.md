---
name: marketing_core-bundle
description: Combined Marketing_Core skills for Manus AI
---

## Marketing_Core Super-Skill Bundle

### Skill: brand


# Brand

Brand identity, voice, messaging, asset management, and consistency frameworks.

## When to Use

- Brand voice definition and content tone guidance
- Visual identity standards and style guide development
- Messaging framework creation
- Brand consistency review and audit
- Asset organization, naming, and approval
- Color palette management and typography specs

## Quick Start

**Inject brand context into prompts:**
```bash
node scripts/inject-brand-context.cjs
node scripts/inject-brand-context.cjs --json
```

**Validate an asset:**
```bash
node scripts/validate-asset.cjs <asset-path>
```

**Extract/compare colors:**
```bash
node scripts/extract-colors.cjs --palette
node scripts/extract-colors.cjs <image-path>
```

## Brand Sync Workflow

```bash
# 1. Edit docs/brand-guidelines.md (or use /brand update)
# 2. Sync to design tokens
node scripts/sync-brand-to-tokens.cjs
# 3. Verify
node scripts/inject-brand-context.cjs --json | head -20
```

**Files synced:**
- `docs/brand-guidelines.md` → Source of truth
- `assets/design-tokens.json` → Token definitions
- `assets/design-tokens.css` → CSS variables

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `update` | Update brand identity and sync to all design systems | `references/update.md` |

## References

| Topic | File |
|-------|------|
| Voice Framework | `references/voice-framework.md` |
| Visual Identity | `references/visual-identity.md` |
| Messaging | `references/messaging-framework.md` |
| Consistency | `references/consistency-checklist.md` |
| Guidelines Template | `references/brand-guideline-template.md` |
| Asset Organization | `references/asset-organization.md` |
| Color Management | `references/color-palette-management.md` |
| Typography | `references/typography-specifications.md` |
| Logo Usage | `references/logo-usage-rules.md` |
| Approval Checklist | `references/approval-checklist.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/inject-brand-context.cjs` | Extract brand context for prompt injection |
| `scripts/sync-brand-to-tokens.cjs` | Sync brand-guidelines.md → design-tokens.json/css |
| `scripts/validate-asset.cjs` | Validate asset naming, size, format |
| `scripts/extract-colors.cjs` | Extract and compare colors against palette |

## Templates

| Template | Purpose |
|----------|---------|
| `templates/brand-guidelines-starter.md` | Complete starter template for new brands |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments

---
### Skill: content-marketing


# Content Marketing

Strategic content planning, editorial workflows, and content optimization frameworks.

## When to Use

- Content strategy development
- Editorial calendar creation
- Blog post planning
- Content pillar/cluster mapping
- Content audit needed
- Repurposing workflows

## Core Capabilities

### Content Strategy
Load: `references/content-strategy-framework.md`

### Editorial Calendar
Load: `references/editorial-calendar-template.md`

### Blog Post Templates
Load: `references/blog-post-templates.md`

### Content Audit
Load: `references/content-audit-checklist.md`

## Quick Reference

**Content Pillars:** 3-5 core themes aligned with business goals

**Content Types:** Blog, video, podcast, social, email

**Audit Actions:** Keep, Update, Consolidate, Redirect, Delete

## Workflow

### Content Strategy Workflow
1. Audit existing content
2. Define audience personas
3. Identify content pillars (3-5)
4. Map topic clusters per pillar
5. Create editorial calendar
6. Define production workflow
7. Set measurement framework

### Blog Planning Workflow
1. Keyword research (use seo skill)
2. Select template based on intent
3. Create content brief
4. Outline → Draft → Edit → Publish

### Content Repurposing
- Blog → Social posts, email sequence, video script
- Podcast → Blog post
- Webinar → Multiple blogs

## Report Output

**Activate:** `assets-organizing` skill for report file paths

Content reports go to `assets/reports/content/{date}-{content-type}-audit.md`

## Agent Integration

**Primary Agents:** content-creator, campaign-manager, attraction-specialist

**Skill Dependencies:** seo, brand, creativity, assets-organizing (report organization)

## Best Practices

1. Lead with value, not promotion
2. Match content to buyer journey stage
3. Maintain consistent publishing schedule
4. Update evergreen content quarterly
5. Repurpose before creating new
6. Measure content ROI, not just traffic

---
### Skill: social


# Social

Social media content creation, scheduling, and platform management.

<args>$ARGUMENTS</args>

## When to Use

- Social media post creation (any platform)
- Content scheduling and calendar management
- Platform-specific content optimization
- Thread/carousel/reel creation
- Engagement strategy and hook writing

## Platforms

`twitter`/`x`, `linkedin`, `instagram`, `tiktok`, `youtube`, `facebook`, `threads`

## Content Types

`post`, `thread`, `carousel`, `story`, `reel`

## Workflow

1. Parse platform + content type from `$ARGUMENTS`
2. Use `social-media-manager` agent for platform best practices
3. Use `content-creator` + `copywriter` agents for copy
4. Platform-specific formatting + hashtag research
5. Output to `assets/posts/{platform}/{date}-{slug}.md`

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `schedule` | Schedule social media posts | `references/schedule.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| Platform Specs | `references/platform-specs.md` |
| Hook Writing | `references/hook-writing.md` |
| Engagement Templates | `references/engagement-templates.md` |
| Thread Templates | `references/thread-templates.md` |
| Posting Best Practices | `references/posting-best-practices.md` |
| Rate Limits & Errors | `references/rate-limits-errors.md` |
| Unified API Services | `references/unified-api-services.md` |
| X/Twitter Workflow | `references/x-twitter-workflow.md` |
| LinkedIn Workflow | `references/linkedin-workflow.md` |
| Facebook Workflow | `references/facebook-workflow.md` |
| Threads Workflow | `references/threads-workflow.md` |
| TikTok Workflow | `references/tiktok-workflow.md` |
| YouTube Workflow | `references/youtube-workflow.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/schedule-post.js` | Schedule posts via API |
| `scripts/validate-post-content.js` | Validate post content against platform rules |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments

---
### Skill: seo


# SEO

Technical SEO, keyword research (ReviewWeb.site API), Google Search Console API, and programmatic SEO.

<args>$ARGUMENTS</args>

## When to Use

- Keyword research with real data (volume, difficulty, CPC)
- Competitor domain analysis (traffic, top keywords, backlinks)
- Google Search Console data (queries, clicks, impressions, CTR, position)
- SEO audit or technical analysis
- JSON+LD schema generation
- Programmatic SEO (pSEO) templates
- Core Web Vitals measurement

## Quick Start: Google Search Console

```bash
node scripts/gsc-auth.cjs --auth                     # Authenticate (one-time)
node scripts/gsc-query.cjs --sites                    # List sites
node scripts/gsc-query.cjs --top-queries -s URL       # Top queries
node scripts/gsc-query.cjs --low-ctr -s URL -o low-ctr.csv -f csv
```

Config: `google_client_secret.json` in `.opencode/secrets/` or `~/.opencode/secrets/`

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `audit` | Technical SEO audit | `references/audit.md` |
| `keywords` | Keyword research & planning | `references/keywords.md` |
| `pseo` | Programmatic SEO template generation | `references/pseo.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/gsc-auth.cjs` | OAuth2 authentication flow |
| `scripts/gsc-query.cjs` | Query analytics, sitemaps, URL inspection |
| `scripts/gsc-config-loader.cjs` | Cross-platform config/token resolution |
| `scripts/analyze-keywords.cjs` | Keyword research via ReviewWeb.site API |
| `scripts/audit-core-web-vitals.cjs` | Core Web Vitals measurement |
| `scripts/generate-sitemap.cjs` | XML sitemap generation |
| `scripts/generate-schema.cjs` | JSON+LD schema generator |
| `scripts/validate-schema.cjs` | Validate JSON-LD |
| `scripts/pseo-generator.cjs` | pSEO page generation |

## References

**Search Console:** `references/google-search-console-api-guide.md`, `references/search-console-query-patterns.md`

**API:** `references/reviewweb-api.md`, `references/reviewweb-content-api.md`

**Audit:** `references/seo-audit-workflow.md`, `references/browser-seo-audit-workflow.md`

**Keyword Research:** `references/keyword-research-workflow.md`, `references/keyword-clustering-methodology.md`, `references/content-gap-analysis-framework.md`

**Technical SEO:** `references/technical-seo-checklist.md`, `references/core-web-vitals-remediation.md`, `references/sitemap-best-practices.md`, `references/robots-txt-best-practices-2025.md`, `references/canonical-url-strategy.md`, `references/mobile-seo-checklist.md`

**On-Page SEO:** `references/on-page-seo-checklist-2025.md`, `references/meta-tag-templates.md`, `references/semantic-seo-framework.md`, `references/readability-scoring-guide.md`, `references/internal-linking-automation.md`

**Programmatic SEO:** `references/pseo-templates.md`, `references/pseo-best-practices.md`, `references/pseo-template-syntax.md`, `references/pseo-url-structure-guide.md`, `references/pseo-scale-architecture.md`

**Link Building:** `references/backlink-analysis-framework.md`, `references/link-building-campaign-framework.md`, `references/outreach-email-templates.md`, `references/directory-submission-list.md`

**Schema:** `references/schema-generation.md`, `references/schema-templates/`

## Agents Used

- `seo-specialist` — SEO audit and optimization
- `attraction-specialist` — Keyword research

## Output

- Audit reports → `assets/reports/seo/{date}-{domain}-audit.md`
- Keyword reports → `assets/reports/seo/{date}-{topic}-keywords.md`
- CWV reports → `assets/reports/seo/{date}-{domain}-cwv.md`
- Schema files → `assets/seo/schemas/{page}-schema.json`

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments

---
### Skill: analytics


# Marketing Analytics

Performance measurement, reporting, and data-driven optimization.

## When to Use

- Campaign performance analysis
- KPI dashboard creation
- Attribution modeling
- ROI calculation
- A/B test analysis
- Funnel optimization
- Report generation

## Core Capabilities

### KPI Framework
Load: `references/marketing-kpis.md`

### Reporting Templates
Load: `references/report-templates.md`

### Attribution Models
Load: `references/attribution-models.md`

### Analysis Workflows
Load: `references/analysis-workflows.md`

## Quick Reference

**Core Marketing KPIs:**
| Category | Metrics |
|----------|---------|
| Acquisition | CAC, CPL, Traffic |
| Engagement | CTR, Time on Site, Bounce |
| Conversion | CVR, ROAS, Revenue |
| Retention | LTV, Churn, NPS |

**Reporting Cadence:**
- Daily: Spend, impressions, clicks
- Weekly: Conversions, ROI by channel
- Monthly: Full funnel, trends
- Quarterly: Strategic review

## Workflow

### Campaign Analysis
1. Define success metrics
2. Pull data from sources
3. Calculate key ratios
4. Compare to benchmarks
5. Identify patterns
6. Generate insights
7. Recommend actions

### A/B Test Analysis
1. Check sample size
2. Calculate statistical significance
3. Compare conversion rates
4. Determine winner
5. Document learnings

## Report Output

**Activate:** `assets-organizing` skill for report file paths

Reports go to `assets/reports/analytics/` with naming `{date}-{report-type}.md`

**Template:** `references/report-templates.md`

Reports include:
- Mermaid.js charts (pie, bar, flowchart)
- Prioritized recommendations table
- Actionable next steps with owners

## Google Analytics 4 API

### Setup
```bash
npm install @google-analytics/admin @google-analytics/data
```

Credentials: `.opencode/secrets/ga_service_account.json` or `google_client_secret.json`

### Scripts
| Script | Purpose |
|--------|---------|
| `scripts/ga-config-loader.cjs` | Load credentials from .opencode/secrets |
| `scripts/ga-list-accounts.cjs` | List GA4 accounts & properties |
| `scripts/ga-run-report.cjs` | Run custom reports |
| `scripts/ga-auth-setup.cjs` | OAuth authentication setup |

### Quick Usage
```bash
# List accounts
node .opencode/skills/analytics/scripts/ga-list-accounts.cjs --summaries

# Run report
node .opencode/skills/analytics/scripts/ga-run-report.cjs \
  --property=PROPERTY_ID \
  --dimensions=country,city \
  --metrics=activeUsers,sessions
```

### API References
- `references/ga-admin-api.md` - Admin API (property config)
- `references/ga-data-api.md` - Data API (reporting)

## Agent Integration

**Primary Agents:** data-analyst, campaign-manager, growth-specialist

**Data Sources:** GA4, Ads platforms, CRM, Email tools

## Best Practices

1. Track leading indicators, not just lagging
2. Compare apples to apples (same timeframes)
3. Statistical significance before conclusions
4. Attribution ≠ causation
5. Report insights, not just numbers
6. Automate recurring reports

---
### Skill: copywriting


# Copywriting

Formulas, templates, patterns, and writing styles for high-converting copy.

## When to Use

- Writing headlines/subject lines, landing page copy, email campaigns
- Social posts, product descriptions, CTA optimization, A/B variations
- Applying custom writing styles from user documents

## Writing Styles

Load: `references/writing-styles.md` | Full catalog: `assets/writing-styles/default.md` (50 styles)

**Extract styles from multi-format files:**
```bash
python .opencode/skills/copywriting/scripts/extract-writing-styles.py --list        # List files
python .opencode/skills/copywriting/scripts/extract-writing-styles.py --style <name> # Extract style
```

**Formats:** `.md` `.txt` `.pdf` `.docx` `.xlsx` `.pptx` `.jpg` `.png` `.mp4` (docs/media need `GEMINI_API_KEY`)

## Copy Formulas

Load: `references/copy-formulas.md`

| Formula | Structure | Best For |
|---------|-----------|----------|
| AIDA | Attention → Interest → Desire → Action | Landing pages, ads |
| PAS | Problem → Agitate → Solution | Email, sales pages |
| BAB | Before → After → Bridge | Testimonials, case studies |
| 4Ps | Promise → Picture → Proof → Push | Long-form sales |
| 4Us | Urgent + Unique + Useful + Ultra-specific | Headlines |
| FAB | Feature → Advantage → Benefit | Product descriptions |

## Headlines

Load: `references/headline-templates.md`

Patterns: "How to [X] without [Y]" • "[Number] ways to [benefit]" • "The secret to [outcome]" • "Why [belief] is wrong"

## Email Copy

Load: `references/email-copy.md`

Subject lines: Curiosity gap • Benefit-driven • Question • Urgency

## Landing Pages & CTAs

Load: `references/landing-page-copy.md` | `references/cta-patterns.md`

Hero: Headline (promise) → Subheadline (how) → CTA (action) → Social proof
CTAs: "Start [verb]ing" • "Get [benefit]" • "Yes, I want [benefit]"

## References

| File | Purpose |
|------|---------|
| `references/writing-styles.md` | 30 writing styles quick reference |
| `references/copy-formulas.md` | AIDA, PAS, BAB, 4Ps, FAB formulas |
| `references/headline-templates.md` | Headline patterns & templates |
| `references/email-copy.md` | Email copy patterns |
| `references/landing-page-copy.md` | Landing page structure |
| `references/cta-patterns.md` | CTA optimization |
| `references/power-words.md` | Power words by emotion |
| `references/social-media-copy.md` | Platform-specific copy |
| `scripts/extract-writing-styles.py` | Extract styles from multi-format files (PDF, DOCX, images) |
| `templates/copy-brief.md` | Creative brief template |

## Agent Integration

**Primary:** copywriter | **Related:** brand, content-marketing, email

## Best Practices

1. Lead with benefit, not feature | 2. One CTA per piece
3. Specificity > vague claims | 4. Read aloud—if awkward, rewrite
5. Test headlines first | 6. Match copy to awareness level

---
### Skill: email


# Email

Email content creation, automation flows, and campaign management.

<args>$ARGUMENTS</args>

## When to Use

- Email content generation (newsletter, cold, launch, nurture, welcome, winback)
- Email automation flow design
- Drip sequence creation
- Subject line optimization
- Deliverability best practices

## Email Types

`newsletter`, `cold`, `followup`, `launch`, `nurture`, `welcome`, `winback`

## Workflow

1. Parse type from `$ARGUMENTS`
2. Gather context via `AskUserQuestion` (audience, message, CTA)
3. Use `email-wizard` + `copywriter` agents
4. Generate subject lines (3-5 variants), preview text, body, CTA
5. Output to `assets/copy/emails/{date}-{type}-{slug}.md`

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `flow` | Generate complete email automation sequence | `references/flow.md` |
| `sequence` | Generate complete email drip sequence with copy | `references/sequence.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| Automation Flows | `references/automation-flows.md` |
| Subject Line Formulas | `references/subject-line-formulas.md` |
| Email Templates | `references/email-templates.md` |
| Deliverability Checklist | `references/deliverability-checklist.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments

---
### Skill: funnel


Design and optimize marketing funnels.

<args>$ARGUMENTS</args>

## Actions
- `design [type]` - Design new funnel
- `analyze` - Analyze existing funnel
- `optimize` - Optimization recommendations

## Funnel Types
- `lead-magnet` - Lead capture funnel
- `webinar` - Webinar registration funnel
- `product-launch` - Product launch sequence
- `evergreen` - Evergreen sales funnel
- `tripwire` - Low-ticket tripwire funnel

## Workflow

1. **Parse Arguments**
   - Extract action (design/analyze/optimize)
   - Extract funnel type (for design)

2. **Design Workflow**
   - Use `funnel-architect` agent for funnel architecture
   - Activate `campaign` skill
   - Design stages:
     - Traffic source
     - Landing page
     - Lead capture
     - Nurture sequence
     - Sales page
     - Checkout
     - Follow-up
   - Define metrics per stage

3. **Analyze Workflow**
   - Use `analytics-analyst` agent for funnel metrics
   - Calculate conversion rates per stage
   - Identify drop-off points
   - Benchmark against industry standards

4. **Optimize Workflow**
   - Use `funnel-architect` for recommendations
   - Use `sale-enabler` for conversion tactics
   - Priority-ranked improvements
   - A/B test suggestions

5. **Output**
   - Funnel designs → `assets/funnels/designs/{date}-{slug}-funnel.md`
   - Analysis reports → `assets/funnels/audits/{date}-{funnel}-audit.md`

## Agents Used
- `funnel-architect` - Funnel design
- `sale-enabler` - Conversion optimization
- `analytics-analyst` - Performance analysis

## Skills Used
- `campaign` - Funnel frameworks
- `analytics` - Metrics tracking
- `assets-organizing` - Standardized output paths

## Output
- Funnel designs → `assets/funnels/designs/{date}-{slug}-funnel.md`
- Funnel audits → `assets/funnels/audits/{date}-{funnel}-audit.md`
- A/B tests → `assets/funnels/tests/{date}-{test-name}.md`

## Examples
```
/funnel design lead-magnet
/funnel design webinar
/funnel analyze
/funnel optimize
```

---
### Skill: paid-ads


# Paid Ads

You are an expert performance marketer with direct access to ad platform accounts. Your goal is to help create, optimize, and scale paid advertising campaigns that drive efficient customer acquisition.

## Before Starting

Gather this context (ask if not provided):

### 1. Campaign Goals
- What's the primary objective? (Awareness, traffic, leads, sales, app installs)
- What's the target CPA or ROAS?
- What's the monthly/weekly budget?
- Any constraints? (Brand guidelines, compliance, geographic)

### 2. Product & Offer
- What are you promoting? (Product, free trial, lead magnet, demo)
- What's the landing page URL?
- What makes this offer compelling?
- Any promotions or urgency elements?

### 3. Audience
- Who is the ideal customer?
- What problem does your product solve for them?
- What are they searching for or interested in?
- Do you have existing customer data for lookalikes?

### 4. Current State
- Have you run ads before? What worked/didn't?
- Do you have existing pixel/conversion data?
- What's your current funnel conversion rate?
- Any existing creative assets?

---

## Platform Selection Guide

### Google Ads
**Best for:** High-intent search traffic, capturing existing demand
**Use when:**
- People actively search for your solution
- You have clear keywords with commercial intent
- You want bottom-of-funnel conversions

**Campaign types:**
- Search: Keyword-targeted text ads
- Performance Max: AI-driven cross-channel
- Display: Banner ads across Google network
- YouTube: Video ads
- Demand Gen: Discovery and Gmail placements

### Meta (Facebook/Instagram)
**Best for:** Demand generation, visual products, broad targeting
**Use when:**
- Your product has visual appeal
- You're creating demand (not just capturing it)
- You have strong creative assets
- You want to build audiences for retargeting

**Campaign types:**
- Advantage+ Shopping: E-commerce automation
- Lead Gen: In-platform lead forms
- Conversions: Website conversion optimization
- Traffic: Link clicks to site
- Engagement: Social proof building

### LinkedIn Ads
**Best for:** B2B targeting, reaching decision-makers
**Use when:**
- You're selling to businesses
- Job title/company targeting matters
- Higher price points justify higher CPCs
- You need to reach specific industries

**Campaign types:**
- Sponsored Content: Feed posts
- Message Ads: Direct InMail
- Lead Gen Forms: In-platform capture
- Document Ads: Gated content
- Conversation Ads: Interactive messaging

### Twitter/X Ads
**Best for:** Tech audiences, real-time relevance, thought leadership
**Use when:**
- Your audience is active on X
- You have timely/trending content
- You want to amplify organic content
- Lower CPMs matter more than precision targeting

### TikTok Ads
**Best for:** Younger demographics, viral creative, brand awareness
**Use when:**
- Your audience skews younger (18-34)
- You can create native-feeling video content
- Brand awareness is a goal
- You have creative capacity for video

---

## Campaign Structure Best Practices

### Account Organization

```
Account
├── Campaign 1: [Objective] - [Audience/Product]
│   ├── Ad Set 1: [Targeting variation]
│   │   ├── Ad 1: [Creative variation A]
│   │   ├── Ad 2: [Creative variation B]
│   │   └── Ad 3: [Creative variation C]
│   └── Ad Set 2: [Targeting variation]
│       └── Ads...
└── Campaign 2...
```

### Naming Conventions

Use consistent naming for easy analysis:

```
[Platform]_[Objective]_[Audience]_[Offer]_[Date]

Examples:
META_Conv_Lookalike-Customers_FreeTrial_2024Q1
GOOG_Search_Brand_Demo_Ongoing
LI_LeadGen_CMOs-SaaS_Whitepaper_Mar24
```

### Budget Allocation Framework

**Testing phase (first 2-4 weeks):**
- 70% to proven/safe campaigns
- 30% to testing new audiences/creative

**Scaling phase:**
- Consolidate budget into winning combinations
- Increase budgets 20-30% at a time
- Wait 3-5 days between increases for algorithm learning

---

## Ad Copy Frameworks

### Primary Text Formulas

**Problem-Agitate-Solve (PAS):**
```
[Problem statement]
[Agitate the pain]
[Introduce solution]
[CTA]
```

Example:
> Spending hours on manual reporting every week?
> While you're buried in spreadsheets, your competitors are making decisions.
> [Product] automates your reports in minutes.
> Start your free trial →

**Before-After-Bridge (BAB):**
```
[Current painful state]
[Desired future state]
[Your product as the bridge]
```

Example:
> Before: Chasing down approvals across email, Slack, and spreadsheets.
> After: Every approval tracked, automated, and on time.
> [Product] connects your tools and keeps projects moving.

**Social Proof Lead:**
```
[Impressive stat or testimonial]
[What you do]
[CTA]
```

Example:
> "We cut our reporting time by 75%." — Sarah K., Marketing Director
> [Product] automates the reports you hate building.
> See how it works →

### Headline Formulas

**For Search Ads:**
- [Keyword] + [Benefit]: "Project Management That Teams Actually Use"
- [Action] + [Outcome]: "Automate Reports | Save 10 Hours Weekly"
- [Question]: "Tired of Manual Data Entry?"
- [Number] + [Benefit]: "500+ Teams Trust [Product] for [Outcome]"

**For Social Ads:**
- Hook with outcome: "How we 3x'd our conversion rate"
- Hook with curiosity: "The reporting hack no one talks about"
- Hook with contrarian: "Why we stopped using [common tool]"
- Hook with specificity: "The exact template we use for..."

### CTA Variations

**Soft CTAs (awareness/consideration):**
- Learn More
- See How It Works
- Watch Demo
- Get the Guide

**Hard CTAs (conversion):**
- Start Free Trial
- Get Started Free
- Book a Demo
- Claim Your Discount
- Buy Now

**Urgency CTAs (when genuine):**
- Limited Time: 30% Off
- Offer Ends [Date]
- Only X Spots Left

---

## Audience Targeting Strategies

### Google Ads Audiences

**Search campaigns:**
- Keywords (exact, phrase, broad match)
- Audience layering (observation mode first)
- Remarketing lists for search ads (RLSA)

**Display/YouTube:**
- Custom intent (based on search behavior)
- In-market audiences
- Affinity audiences
- Customer match (upload email lists)
- Similar/lookalike audiences

### Meta Audiences

**Core audiences (interest/demographic):**
- Layer interests with AND logic for precision
- Exclude existing customers
- Start broad, let algorithm optimize

**Custom audiences:**
- Website visitors (by page, time on site, frequency)
- Customer list uploads
- Engagement (video viewers, page engagers)
- App activity

**Lookalike audiences:**
- Source: Best customers (by LTV, not just all customers)
- Size: Start 1%, expand to 1-3% as you scale
- Layer: Lookalike + interest for early testing

### LinkedIn Audiences

**Job-based targeting:**
- Job titles (be specific, avoid broad)
- Job functions + seniority
- Skills (self-reported)

**Company-based targeting:**
- Company size
- Industry
- Company names (ABM)
- Company growth rate

**Combinations that work:**
- Job function + seniority + company size
- Industry + job title
- Company list + decision-maker titles

---

## Creative Best Practices

### Image Ads

**What works:**
- Clear product screenshots showing UI
- Before/after comparisons
- Stats and numbers as focal point
- Human faces (real, not stock)
- Bold, readable text overlay (keep under 20%)

**What doesn't:**
- Generic stock photos
- Too much text
- Cluttered visuals
- Low contrast/hard to read

### Video Ads

**Structure for short-form (15-30 sec):**
1. Hook (0-3 sec): Pattern interrupt, question, or bold statement
2. Problem (3-8 sec): Relatable pain point
3. Solution (8-20 sec): Show product/benefit
4. CTA (20-30 sec): Clear next step

**Structure for longer-form (60+ sec):**
1. Hook (0-5 sec)
2. Problem deep-dive (5-20 sec)
3. Solution introduction (20-35 sec)
4. Social proof (35-45 sec)
5. How it works (45-55 sec)
6. CTA with offer (55-60 sec)

**Production tips:**
- Captions always (85% watch without sound)
- Vertical for Stories/Reels, square for feed
- Native feel outperforms polished
- First 3 seconds determine if they watch

### Ad Creative Testing

**Testing hierarchy:**
1. Concept/angle (biggest impact)
2. Hook/headline
3. Visual style
4. Body copy
5. CTA

**Testing approach:**
- Test one variable at a time for clean data
- Need 100+ conversions per variant for significance
- Kill losers fast (3-5 days with sufficient spend)
- Iterate on winners

---

## Campaign Optimization

### Key Metrics by Objective

**Awareness:**
- CPM (cost per 1,000 impressions)
- Reach and frequency
- Video view rate / watch time
- Brand lift (if available)

**Consideration:**
- CTR (click-through rate)
- CPC (cost per click)
- Landing page views
- Time on site from ads

**Conversion:**
- CPA (cost per acquisition)
- ROAS (return on ad spend)
- Conversion rate
- Cost per lead / cost per sale

### Optimization Levers

**If CPA is too high:**
1. Check landing page (is the problem post-click?)
2. Tighten audience targeting
3. Test new creative angles
4. Improve ad relevance/quality score
5. Adjust bid strategy

**If CTR is low:**
- Creative isn't resonating → test new hooks/angles
- Audience mismatch → refine targeting
- Ad fatigue → refresh creative
- Weak offer → improve value proposition

**If CPM is high:**
- Audience too narrow → expand targeting
- High competition → try different placements
- Low relevance score → improve creative fit
- Bidding too aggressively → adjust bid caps

### Bid Strategies

**Manual/controlled:**
- Use when: Learning phase, small budgets, need control
- Manual CPC, bid caps, cost caps

**Automated/smart:**
- Use when: Sufficient conversion data (50+ per month), scaling
- Target CPA, target ROAS, maximize conversions

**Progression:**
1. Start with manual or cost caps
2. Gather conversion data (50+ conversions)
3. Switch to automated with targets based on historical data
4. Monitor and adjust targets based on results

---

## Retargeting Strategies

### Funnel-Based Retargeting

**Top of funnel (awareness):**
- Audience: Blog readers, video viewers, social engagers
- Message: Educational content, social proof
- Goal: Move to consideration

**Middle of funnel (consideration):**
- Audience: Pricing page visitors, feature page visitors
- Message: Case studies, demos, comparisons
- Goal: Move to decision

**Bottom of funnel (decision):**
- Audience: Cart abandoners, trial users, demo no-shows
- Message: Urgency, objection handling, offers
- Goal: Convert

### Retargeting Windows

| Stage | Window | Frequency Cap |
|-------|--------|---------------|
| Hot (cart/trial) | 1-7 days | Higher OK |
| Warm (key pages) | 7-30 days | 3-5x/week |
| Cold (any visit) | 30-90 days | 1-2x/week |

### Exclusions to Set Up

Always exclude:
- Existing customers (unless upsell campaign)
- Recent converters (7-14 day window)
- Bounced visitors (<10 sec on site)
- Irrelevant pages (careers, support)

---

## Reporting & Analysis

### Weekly Review Checklist

- [ ] Spend vs. budget pacing
- [ ] CPA/ROAS vs. targets
- [ ] Top and bottom performing ads
- [ ] Audience performance breakdown
- [ ] Frequency check (fatigue risk)
- [ ] Landing page conversion rate
- [ ] Any disapproved ads or policy issues

### Monthly Analysis

- [ ] Overall channel performance vs. goals
- [ ] Creative performance trends
- [ ] Audience insights and learnings
- [ ] Budget reallocation recommendations
- [ ] Test results and next tests
- [ ] Competitive landscape changes

### Attribution Considerations

- Platform attribution is inflated (they want credit)
- Use UTM parameters consistently
- Compare platform data to GA4/analytics
- Consider incrementality testing for mature accounts
- Look at blended CAC, not just platform CPA

---

## Platform-Specific Setup Guides

### Google Ads Setup Checklist

- [ ] Conversion tracking installed and tested
- [ ] Google Analytics 4 linked
- [ ] Audience lists created (remarketing, customer match)
- [ ] Negative keyword lists built
- [ ] Ad extensions set up (sitelinks, callouts, structured snippets)
- [ ] Brand campaign running (protect branded terms)
- [ ] Competitor campaign considered
- [ ] Location and language targeting set
- [ ] Ad schedule aligned with business hours (if B2B)

### Meta Ads Setup Checklist

- [ ] Pixel installed and events firing
- [ ] Conversions API set up (server-side tracking)
- [ ] Custom audiences created
- [ ] Product catalog connected (if e-commerce)
- [ ] Domain verified
- [ ] Business Manager properly configured
- [ ] Aggregated event measurement prioritized
- [ ] Creative assets in correct sizes
- [ ] UTM parameters in all URLs

### LinkedIn Ads Setup Checklist

- [ ] Insight Tag installed
- [ ] Conversion tracking configured
- [ ] Matched audiences created
- [ ] Company page connected
- [ ] Lead gen form templates created
- [ ] Document assets uploaded (for Document Ads)
- [ ] Audience size validated (not too narrow)
- [ ] Budget realistic for LinkedIn CPCs ($8-15+)

---

## Common Mistakes to Avoid

### Strategy Mistakes
- Launching without conversion tracking
- Too many campaigns/ad sets (fragmenting budget)
- Not giving algorithms enough learning time
- Optimizing for wrong metric (clicks vs. conversions)
- Ignoring landing page experience

### Targeting Mistakes
- Audiences too narrow (can't exit learning phase)
- Audiences too broad (wasting spend)
- Not excluding existing customers
- Overlapping audiences competing with each other
- Ignoring negative keywords (Search)

### Creative Mistakes
- Only running one ad per ad set
- Not refreshing creative (ad fatigue)
- Mismatch between ad and landing page
- Ignoring mobile experience
- Too much text in images (Meta)

### Budget Mistakes
- Spreading budget too thin across campaigns
- Making big budget changes (disrupts learning)
- Not accounting for platform minimums
- Stopping campaigns during learning phase
- Weekend/off-hours spend without adjustment

---

## Questions to Ask

If you need more context:
1. What platform(s) are you currently running or want to start with?
2. What's your monthly ad budget?
3. What does a successful conversion look like (and what's it worth)?
4. Do you have existing creative assets or need to create them?
5. What landing page will ads point to?
6. Do you have pixel/conversion tracking set up?

---

## Related Skills

- **copywriting**: For landing page copy that converts ad traffic
- **analytics-tracking**: For proper conversion tracking setup
- **ab-test-setup**: For landing page testing to improve ROAS
- **page-cro**: For optimizing post-click conversion rates

---
### Skill: competitor


# Competitor

Competitive analysis and competitor comparison content creation.

<args>$ARGUMENTS</args>

## When to Use

- Analyze competitor websites and positioning
- Content gap analysis vs competitors
- SEO comparison with competitors
- Create competitor alternative/vs/comparison pages
- Generate sales battlecards
- Track competitors

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `alternatives` | Create competitor comparison & alternative pages | `references/alternatives.md` |

## Actions

- `analyze [url]` - Analyze competitor website
- `content [url]` - Content gap analysis
- `seo [url]` - SEO comparison
- `alternatives [competitor]` - Create alternative/vs pages
- `list` - List tracked competitors

## Workflow

1. **Parse Arguments** - Extract action and competitor URL/name

2. **Analyze Workflow**
   - Use `WebFetch` to retrieve competitor data
   - Use `researcher` agent for comprehensive analysis (value prop, pricing, audience, channels, strengths/weaknesses)
   - Use `attraction-specialist` for positioning

3. **Content Gap Workflow**
   - Use `seo-specialist` for content audit
   - Compare content topics and formats
   - Identify gaps and opportunities

4. **SEO Comparison Workflow**
   - Use `seo-specialist` agent
   - Activate `seo` skill
   - Compare keyword rankings, backlinks, domain authority, content quality

5. **Alternatives Workflow**
   - Load `references/alternatives.md`
   - Research competitor and your product data
   - Generate comparison pages (4 formats: singular alt, plural alts, vs, A-vs-B)

6. **Output** - Reports → `reports/competitors/{date}-{name}.md`

## Agents Used
- `researcher` - Competitor intelligence
- `attraction-specialist` - Market positioning
- `seo-specialist` - SEO analysis
- `sale-enabler` - Battlecard generation

## Skills Used
- `seo` - SEO comparison
- `content-marketing` - Content analysis
- `copywriting` - Comparison copy
- `assets-organizing` - Standardized output paths

## Output
- Battlecards → `assets/sales/battlecards/{competitor}.md`
- Analysis → `reports/competitors/{date}-{name}.md`
- Alt/Vs pages → organized by format

## Examples
```
/competitor analyze https://competitor.com
/competitor content https://competitor.com
/competitor seo https://competitor.com
/competitor alternatives notion
/competitor list
```

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments

---
### Skill: marketing-research


# Marketing Research

## Research Methodology

Focus on actionable marketing intelligence: market trends, competitor analysis, audience insights, and campaign benchmarks.
**Be honest, be brutal, straight to the point, and be concise.**

### Phase 1: Scope Definition

First, clearly define the marketing research scope by:
- Identifying target market segments and audience personas
- Determining competitive landscape boundaries
- Establishing KPIs and success metrics to benchmark
- Setting boundaries for research depth (industry, geography, timeframe)

### Phase 2: Systematic Information Gathering

You will employ a multi-source research strategy:

1. **Search Strategy**:
   - Check if `gemini` bash command is available, if so, execute `gemini -m gemini-2.5-flash -p "...your search prompt..."` bash command (timeout: 10 minutes) and save the output using `Report:` path from `## Naming` section (including all citations).
   - If `gemini` bash command is not available, fallback to `WebSearch` tool.
   - Run multiple `gemini` bash commands or `WebSearch` tools in parallel to search for relevant information.
   - Craft precise search queries with relevant keywords
   - Include terms like "best practices", "2024", "latest", "security", "performance"
   - Search for official documentation, GitHub repositories, and authoritative blogs
   - Prioritize results from recognized authorities (official docs, major tech companies, respected developers)
   - **IMPORTANT:** You are allowed to perform at most **5 researches (max 5 tool calls)**, user might request less than this amount, **strictly respect it**, think carefully based on the task before performing each related research topic.

2. **Deep Content Analysis**:
   - When you found a potential Github repository URL, use `docs-seeker` skill to find read it.
   - Focus on official documentation, API references, and technical specifications
   - Analyze README files from popular GitHub repositories
   - Review changelog and release notes for version-specific information

3. **Video Content Research**:
   - Prioritize content from official channels, recognized experts, and major conferences
   - Focus on practical demonstrations and real-world implementations

4. **Cross-Reference Validation**:
   - Verify information across multiple independent sources
   - Check publication dates to ensure currency
   - Identify consensus vs. controversial approaches
   - Note any conflicting information or debates in the community

### Phase 3: Analysis and Synthesis

You will analyze gathered information by:
- Identifying common patterns and best practices
- Evaluating pros and cons of different approaches
- Assessing maturity and stability of technologies
- Recognizing security implications and performance considerations
- Determining compatibility and integration requirements

### Phase 4: Report Generation

**Notes:**
- Research reports are saved using `Report:` path from `## Naming` section.
- If `## Naming` section is not available, ask main agent to provide the output path.

You will create a comprehensive markdown report with the following structure:

```markdown
# Research Report: [Topic]

## Executive Summary
[2-3 paragraph overview of key findings and recommendations]

## Research Methodology
- Sources consulted: [number]
- Date range of materials: [earliest to most recent]
- Key search terms used: [list]

## Key Findings

### 1. Technology Overview
[Comprehensive description of the technology/topic]

### 2. Current State & Trends
[Latest developments, version information, adoption trends]

### 3. Best Practices
[Detailed list of recommended practices with explanations]

### 4. Security Considerations
[Security implications, vulnerabilities, and mitigation strategies]

### 5. Performance Insights
[Performance characteristics, optimization techniques, benchmarks]

## Comparative Analysis
[If applicable, comparison of different solutions/approaches]

## Implementation Recommendations

### Quick Start Guide
[Step-by-step getting started instructions]

### Code Examples
[Relevant code snippets with explanations]

### Common Pitfalls
[Mistakes to avoid and their solutions]

## Resources & References

### Official Documentation
- [Linked list of official docs]

### Recommended Tutorials
- [Curated list with descriptions]

### Community Resources
- [Forums, Discord servers, Stack Overflow tags]

### Further Reading
- [Advanced topics and deep dives]

## Appendices

### A. Glossary
[Technical terms and definitions]

### B. Version Compatibility Matrix
[If applicable]

### C. Raw Research Notes
[Optional: detailed notes from research process]
```

## Quality Standards

You will ensure all research meets these criteria:
- **Accuracy**: Information is verified across multiple sources
- **Currency**: Prioritize information from the last 12 months unless historical context is needed
- **Completeness**: Cover all aspects requested by the user
- **Actionability**: Provide practical, implementable recommendations
- **Clarity**: Use clear language, define technical terms, provide examples
- **Attribution**: Always cite sources and provide links for verification

## Special Considerations

- When researching security topics, always check for recent CVEs and security advisories
- For performance-related research, look for benchmarks and real-world case studies
- When investigating new technologies, assess community adoption and support levels
- For API documentation, verify endpoint availability and authentication requirements
- Always note deprecation warnings and migration paths for older technologies

## Output Requirements

Your final report must:
1. Be saved using the `Report:` path from `## Naming` section with a descriptive filename
2. Include a timestamp of when the research was conducted
3. Provide clear section navigation with a table of contents for longer reports
4. Use code blocks with appropriate syntax highlighting
5. Include diagrams or architecture descriptions where helpful (in mermaid or ASCII art)
6. Conclude with specific, actionable next steps

**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.

**Remember:** You are not just collecting information, but providing strategic technical intelligence that enables informed decision-making. Your research should anticipate follow-up questions and provide comprehensive coverage of the topic while remaining focused and practical.
---
### Skill: marketing-psychology


# Marketing Psychology & Mental Models

You are an expert in applying psychological principles and mental models to marketing. Your goal is to help users understand why people buy, how to influence behavior ethically, and how to make better marketing decisions.

## How to Use This Skill

Mental models are thinking tools that help you make better decisions, understand customer behavior, and create more effective marketing. When helping users:

1. Identify which mental models apply to their situation
2. Explain the psychology behind the model
3. Provide specific marketing applications
4. Suggest how to implement ethically

---

## Foundational Thinking Models

These models sharpen your strategy and help you solve the right problems.

### First Principles
Break problems down to basic truths and build solutions from there. Instead of copying competitors, ask "why" repeatedly to find root causes. Use the 5 Whys technique to tunnel down to what really matters.

**Marketing application**: Don't assume you need content marketing because competitors do. Ask why you need it, what problem it solves, and whether there's a better solution.

### Jobs to Be Done
People don't buy products—they "hire" them to get a job done. Focus on the outcome customers want, not features.

**Marketing application**: A drill buyer doesn't want a drill—they want a hole. Frame your product around the job it accomplishes, not its specifications.

### Circle of Competence
Know what you're good at and stay within it. Venture outside only with proper learning or expert help.

**Marketing application**: Don't chase every channel. Double down where you have genuine expertise and competitive advantage.

### Inversion
Instead of asking "How do I succeed?", ask "What would guarantee failure?" Then avoid those things.

**Marketing application**: List everything that would make your campaign fail—confusing messaging, wrong audience, slow landing page—then systematically prevent each.

### Occam's Razor
The simplest explanation is usually correct. Avoid overcomplicating strategies or attributing results to complex causes when simple ones suffice.

**Marketing application**: If conversions dropped, check the obvious first (broken form, page speed) before assuming complex attribution issues.

### Pareto Principle (80/20 Rule)
Roughly 80% of results come from 20% of efforts. Identify and focus on the vital few.

**Marketing application**: Find the 20% of channels, customers, or content driving 80% of results. Cut or reduce the rest.

### Local vs. Global Optima
A local optimum is the best solution nearby, but a global optimum is the best overall. Don't get stuck optimizing the wrong thing.

**Marketing application**: Optimizing email subject lines (local) won't help if email isn't the right channel (global). Zoom out before zooming in.

### Theory of Constraints
Every system has one bottleneck limiting throughput. Find and fix that constraint before optimizing elsewhere.

**Marketing application**: If your funnel converts well but traffic is low, more conversion optimization won't help. Fix the traffic bottleneck first.

### Opportunity Cost
Every choice has a cost—what you give up by not choosing alternatives. Consider what you're saying no to.

**Marketing application**: Time spent on a low-ROI channel is time not spent on high-ROI activities. Always compare against alternatives.

### Law of Diminishing Returns
After a point, additional investment yields progressively smaller gains.

**Marketing application**: The 10th blog post won't have the same impact as the first. Know when to diversify rather than double down.

### Second-Order Thinking
Consider not just immediate effects, but the effects of those effects.

**Marketing application**: A flash sale boosts revenue (first order) but may train customers to wait for discounts (second order).

### Map ≠ Territory
Models and data represent reality but aren't reality itself. Don't confuse your analytics dashboard with actual customer experience.

**Marketing application**: Your customer persona is a useful model, but real customers are more complex. Stay in touch with actual users.

### Probabilistic Thinking
Think in probabilities, not certainties. Estimate likelihoods and plan for multiple outcomes.

**Marketing application**: Don't bet everything on one campaign. Spread risk and plan for scenarios where your primary strategy underperforms.

### Barbell Strategy
Combine extreme safety with small high-risk/high-reward bets. Avoid the mediocre middle.

**Marketing application**: Put 80% of budget into proven channels, 20% into experimental bets. Avoid moderate-risk, moderate-reward middle.

---

## Understanding Buyers & Human Psychology

These models explain how customers think, decide, and behave.

### Fundamental Attribution Error
People attribute others' behavior to character, not circumstances. "They didn't buy because they're not serious" vs. "The checkout was confusing."

**Marketing application**: When customers don't convert, examine your process before blaming them. The problem is usually situational, not personal.

### Mere Exposure Effect
People prefer things they've seen before. Familiarity breeds liking.

**Marketing application**: Consistent brand presence builds preference over time. Repetition across channels creates comfort and trust.

### Availability Heuristic
People judge likelihood by how easily examples come to mind. Recent or vivid events seem more common.

**Marketing application**: Case studies and testimonials make success feel more achievable. Make positive outcomes easy to imagine.

### Confirmation Bias
People seek information confirming existing beliefs and ignore contradictory evidence.

**Marketing application**: Understand what your audience already believes and align messaging accordingly. Fighting beliefs head-on rarely works.

### The Lindy Effect
The longer something has survived, the longer it's likely to continue. Old ideas often outlast new ones.

**Marketing application**: Proven marketing principles (clear value props, social proof) outlast trendy tactics. Don't abandon fundamentals for fads.

### Mimetic Desire
People want things because others want them. Desire is socially contagious.

**Marketing application**: Show that desirable people want your product. Waitlists, exclusivity, and social proof trigger mimetic desire.

### Sunk Cost Fallacy
People continue investing in something because of past investment, even when it's no longer rational.

**Marketing application**: Know when to kill underperforming campaigns. Past spend shouldn't justify future spend if results aren't there.

### Endowment Effect
People value things more once they own them.

**Marketing application**: Free trials, samples, and freemium models let customers "own" the product, making them reluctant to give it up.

### IKEA Effect
People value things more when they've put effort into creating them.

**Marketing application**: Let customers customize, configure, or build something. Their investment increases perceived value and commitment.

### Zero-Price Effect
Free isn't just a low price—it's psychologically different. "Free" triggers irrational preference.

**Marketing application**: Free tiers, free trials, and free shipping have disproportionate appeal. The jump from $1 to $0 is bigger than $2 to $1.

### Hyperbolic Discounting / Present Bias
People strongly prefer immediate rewards over future ones, even when waiting is more rational.

**Marketing application**: Emphasize immediate benefits ("Start saving time today") over future ones ("You'll see ROI in 6 months").

### Status-Quo Bias
People prefer the current state of affairs. Change requires effort and feels risky.

**Marketing application**: Reduce friction to switch. Make the transition feel safe and easy. "Import your data in one click."

### Default Effect
People tend to accept pre-selected options. Defaults are powerful.

**Marketing application**: Pre-select the plan you want customers to choose. Opt-out beats opt-in for subscriptions (ethically applied).

### Paradox of Choice
Too many options overwhelm and paralyze. Fewer choices often lead to more decisions.

**Marketing application**: Limit options. Three pricing tiers beat seven. Recommend a single "best for most" option.

### Goal-Gradient Effect
People accelerate effort as they approach a goal. Progress visualization motivates action.

**Marketing application**: Show progress bars, completion percentages, and "almost there" messaging to drive completion.

### Peak-End Rule
People judge experiences by the peak (best or worst moment) and the end, not the average.

**Marketing application**: Design memorable peaks (surprise upgrades, delightful moments) and strong endings (thank you pages, follow-up emails).

### Zeigarnik Effect
Unfinished tasks occupy the mind more than completed ones. Open loops create tension.

**Marketing application**: "You're 80% done" creates pull to finish. Incomplete profiles, abandoned carts, and cliffhangers leverage this.

### Pratfall Effect
Competent people become more likable when they show a small flaw. Perfection is less relatable.

**Marketing application**: Admitting a weakness ("We're not the cheapest, but...") can increase trust and differentiation.

### Curse of Knowledge
Once you know something, you can't imagine not knowing it. Experts struggle to explain simply.

**Marketing application**: Your product seems obvious to you but confusing to newcomers. Test copy with people unfamiliar with your space.

### Mental Accounting
People treat money differently based on its source or intended use, even though money is fungible.

**Marketing application**: Frame costs in favorable mental accounts. "$3/day" feels different than "$90/month" even though it's the same.

### Regret Aversion
People avoid actions that might cause regret, even if the expected outcome is positive.

**Marketing application**: Address regret directly. Money-back guarantees, free trials, and "no commitment" messaging reduce regret fear.

### Bandwagon Effect / Social Proof
People follow what others are doing. Popularity signals quality and safety.

**Marketing application**: Show customer counts, testimonials, logos, reviews, and "trending" indicators. Numbers create confidence.

---

## Influencing Behavior & Persuasion

These models help you ethically influence customer decisions.

### Reciprocity Principle
People feel obligated to return favors. Give first, and people want to give back.

**Marketing application**: Free content, free tools, and generous free tiers create reciprocal obligation. Give value before asking for anything.

### Commitment & Consistency
Once people commit to something, they want to stay consistent with that commitment.

**Marketing application**: Get small commitments first (email signup, free trial). People who've taken one step are more likely to take the next.

### Authority Bias
People defer to experts and authority figures. Credentials and expertise create trust.

**Marketing application**: Feature expert endorsements, certifications, "featured in" logos, and thought leadership content.

### Liking / Similarity Bias
People say yes to those they like and those similar to themselves.

**Marketing application**: Use relatable spokespeople, founder stories, and community language. "Built by marketers for marketers" signals similarity.

### Unity Principle
Shared identity drives influence. "One of us" is powerful.

**Marketing application**: Position your brand as part of the customer's tribe. Use insider language and shared values.

### Scarcity / Urgency Heuristic
Limited availability increases perceived value. Scarcity signals desirability.

**Marketing application**: Limited-time offers, low-stock warnings, and exclusive access create urgency. Only use when genuine.

### Foot-in-the-Door Technique
Start with a small request, then escalate. Compliance with small requests leads to compliance with larger ones.

**Marketing application**: Free trial → paid plan → annual plan → enterprise. Each step builds on the last.

### Door-in-the-Face Technique
Start with an unreasonably large request, then retreat to what you actually want. The contrast makes the second request seem reasonable.

**Marketing application**: Show enterprise pricing first, then reveal the affordable starter plan. The contrast makes it feel like a deal.

### Loss Aversion / Prospect Theory
Losses feel roughly twice as painful as equivalent gains feel good. People will work harder to avoid losing than to gain.

**Marketing application**: Frame in terms of what they'll lose by not acting. "Don't miss out" beats "You could gain."

### Anchoring Effect
The first number people see heavily influences subsequent judgments.

**Marketing application**: Show the higher price first (original price, competitor price, enterprise tier) to anchor expectations.

### Decoy Effect
Adding a third, inferior option makes one of the original two look better.

**Marketing application**: A "decoy" pricing tier that's clearly worse value makes your preferred tier look like the obvious choice.

### Framing Effect
How something is presented changes how it's perceived. Same facts, different frames.

**Marketing application**: "90% success rate" vs. "10% failure rate" are identical but feel different. Frame positively.

### Contrast Effect
Things seem different depending on what they're compared to.

**Marketing application**: Show the "before" state clearly. The contrast with your "after" makes improvements vivid.

---

## Pricing Psychology

These models specifically address how people perceive and respond to prices.

### Charm Pricing / Left-Digit Effect
Prices ending in 9 seem significantly lower than the next round number. $99 feels much cheaper than $100.

**Marketing application**: Use .99 or .95 endings for value-focused products. The left digit dominates perception.

### Rounded-Price (Fluency) Effect
Round numbers feel premium and are easier to process. $100 signals quality; $99 signals value.

**Marketing application**: Use round prices for premium products ($500/month), charm prices for value products ($497/month).

### Rule of 100
For prices under $100, percentage discounts seem larger ("20% off"). For prices over $100, absolute discounts seem larger ("$50 off").

**Marketing application**: $80 product: "20% off" beats "$16 off." $500 product: "$100 off" beats "20% off."

### Price Relativity / Good-Better-Best
People judge prices relative to options presented. A middle tier seems reasonable between cheap and expensive.

**Marketing application**: Three tiers where the middle is your target. The expensive tier makes it look reasonable; the cheap tier provides an anchor.

### Mental Accounting (Pricing)
Framing the same price differently changes perception.

**Marketing application**: "$1/day" feels cheaper than "$30/month." "Less than your morning coffee" reframes the expense.

---

## Design & Delivery Models

These models help you design effective marketing systems.

### Hick's Law
Decision time increases with the number and complexity of choices. More options = slower decisions = more abandonment.

**Marketing application**: Simplify choices. One clear CTA beats three. Fewer form fields beat more.

### AIDA Funnel
Attention → Interest → Desire → Action. The classic customer journey model.

**Marketing application**: Structure pages and campaigns to move through each stage. Capture attention before building desire.

### Rule of 7
Prospects need roughly 7 touchpoints before converting. One ad rarely converts; sustained presence does.

**Marketing application**: Build multi-touch campaigns across channels. Retargeting, email sequences, and consistent presence compound.

### Nudge Theory / Choice Architecture
Small changes in how choices are presented significantly influence decisions.

**Marketing application**: Default selections, strategic ordering, and friction reduction guide behavior without restricting choice.

### BJ Fogg Behavior Model
Behavior = Motivation × Ability × Prompt. All three must be present for action.

**Marketing application**: High motivation but hard to do = won't happen. Easy to do but no prompt = won't happen. Design for all three.

### EAST Framework
Make desired behaviors: Easy, Attractive, Social, Timely.

**Marketing application**: Reduce friction (easy), make it appealing (attractive), show others doing it (social), ask at the right moment (timely).

### COM-B Model
Behavior requires: Capability, Opportunity, Motivation.

**Marketing application**: Can they do it (capability)? Is the path clear (opportunity)? Do they want to (motivation)? Address all three.

### Activation Energy
The initial energy required to start something. High activation energy prevents action even if the task is easy overall.

**Marketing application**: Reduce starting friction. Pre-fill forms, offer templates, show quick wins. Make the first step trivially easy.

### North Star Metric
One metric that best captures the value you deliver to customers. Focus creates alignment.

**Marketing application**: Identify your North Star (active users, completed projects, revenue per customer) and align all efforts toward it.

### The Cobra Effect
When incentives backfire and produce the opposite of intended results.

**Marketing application**: Test incentive structures. A referral bonus might attract low-quality referrals gaming the system.

---

## Growth & Scaling Models

These models explain how marketing compounds and scales.

### Feedback Loops
Output becomes input, creating cycles. Positive loops accelerate growth; negative loops create decline.

**Marketing application**: Build virtuous cycles: more users → more content → better SEO → more users. Identify and strengthen positive loops.

### Compounding
Small, consistent gains accumulate into large results over time. Early gains matter most.

**Marketing application**: Consistent content, SEO, and brand building compound. Start early; benefits accumulate exponentially.

### Network Effects
A product becomes more valuable as more people use it.

**Marketing application**: Design features that improve with more users: shared workspaces, integrations, marketplaces, communities.

### Flywheel Effect
Sustained effort creates momentum that eventually maintains itself. Hard to start, easy to maintain.

**Marketing application**: Content → traffic → leads → customers → case studies → more content. Each element powers the next.

### Switching Costs
The price (time, money, effort, data) of changing to a competitor. High switching costs create retention.

**Marketing application**: Increase switching costs ethically: integrations, data accumulation, workflow customization, team adoption.

### Exploration vs. Exploitation
Balance trying new things (exploration) with optimizing what works (exploitation).

**Marketing application**: Don't abandon working channels for shiny new ones, but allocate some budget to experiments.

### Critical Mass / Tipping Point
The threshold after which growth becomes self-sustaining.

**Marketing application**: Focus resources on reaching critical mass in one segment before expanding. Depth before breadth.

### Survivorship Bias
Focusing on successes while ignoring failures that aren't visible.

**Marketing application**: Study failed campaigns, not just successful ones. The viral hit you're copying had 99 failures you didn't see.

---

## Quick Reference

When facing a marketing challenge, consider:

| Challenge | Relevant Models |
|-----------|-----------------|
| Low conversions | Hick's Law, Activation Energy, BJ Fogg, Friction |
| Price objections | Anchoring, Framing, Mental Accounting, Loss Aversion |
| Building trust | Authority, Social Proof, Reciprocity, Pratfall Effect |
| Increasing urgency | Scarcity, Loss Aversion, Zeigarnik Effect |
| Retention/churn | Endowment Effect, Switching Costs, Status-Quo Bias |
| Growth stalling | Theory of Constraints, Local vs Global Optima, Compounding |
| Decision paralysis | Paradox of Choice, Default Effect, Nudge Theory |
| Onboarding | Goal-Gradient, IKEA Effect, Commitment & Consistency |

---

## Questions to Ask

If you need more context:
1. What specific behavior are you trying to influence?
2. What does your customer believe before encountering your marketing?
3. Where in the journey (awareness → consideration → decision) is this?
4. What's currently preventing the desired action?
5. Have you tested this with real customers?

---

## Related Skills

- **page-cro**: Apply psychology to page optimization
- **copywriting**: Write copy using psychological principles
- **popup-cro**: Use triggers and psychology in popups
- **pricing-page optimization**: See page-cro for pricing psychology
- **ab-test-setup**: Test psychological hypotheses

---
### Skill: marketing-planning


# Marketing Planning

Create detailed marketing plans through market research, competitive analysis, strategy design, and actionable campaign documentation.

## Skill Invocation

**Before planning, activate:** `marketing-research` skill for market data, competitor insights, and audience analysis.

## When to Use

Use this skill when:
- Planning marketing campaigns and launches
- Creating content strategies and editorial calendars
- Developing brand positioning and messaging
- Designing customer acquisition funnels
- Building multi-channel marketing initiatives
- Evaluating marketing approach trade-offs

## Core Responsibilities & Rules

Focus on actionable marketing strategy and campaign planning.
**Be honest, be brutal, straight to the point, and be concise.**

### 1. Market Research
Load: `references/research-phase.md`
**Skip if:** Provided with market research reports

### 2. Brand & Context Understanding
Load: `references/brand-context.md`
**Skip if:** Provided with brand guidelines or strategy docs

### 3. Strategy Design
Load: `references/strategy-design.md`

### 4. Plan Creation & Organization
Load: `references/plan-organization.md`

### 5. Task Breakdown & Output Standards
Load: `references/output-standards.md`

## Workflow Process

1. **Initial Analysis** → Read brand docs, understand business context
2. **Research Phase** → Market, competitor, audience research
3. **Synthesis** → Analyze insights, identify positioning opportunities
4. **Strategy Phase** → Define positioning, channels, messaging
5. **Plan Documentation** → Write comprehensive marketing plan
6. **Review & Refine** → Ensure completeness, feasibility, brand alignment

## Output Requirements

- DO NOT execute campaigns - only create plans
- Respond with plan file path and summary
- Ensure self-contained plans with brand context
- Include creative concepts when clarifying approach
- Provide multiple options with trade-offs when appropriate
- Fully respect the `./docs/brand-guidelines.md` file.

**Plan Directory Structure**
```
plans/
└── {date}-campaign-name/
    ├── research/
    │   ├── market-analysis.md
    │   ├── competitor-audit.md
    │   └── audience-insights.md
    ├── reports/
    │   └── campaign-brief.md
    ├── plan.md
    ├── phase-XX-phase-name.md
    └── ...
```

## Active Plan State

Prevents version proliferation by tracking current working plan via session state.

### Active vs Suggested Plans

Check the `## Plan Context` section injected by hooks:
- **"Plan: {path}"** = Active plan, explicitly set via `set-active-plan.cjs` - use for reports
- **"Suggested: {path}"** = Branch-matched, hint only - do NOT auto-use
- **"Plan: none"** = No active plan

### Rules

1. **If "Plan:" shows a path**: Ask "Continue with existing plan? [Y/n]"
2. **If "Suggested:" shows a path**: Inform user, ask if they want to activate or create new
3. **If "Plan: none"**: Create new plan using naming from `## Naming` section
4. **Update on create**: Run `node .opencode/scripts/set-active-plan.cjs {plan-dir}`

### Report Output Location

All agents writing reports MUST:
1. Check `Plan Context` section injected by hooks for `Reports Path`
2. Only `$CK_ACTIVE_PLAN` plans use plan-specific reports path
3. `$CK_SUGGESTED_PLAN` plans use default `plans/reports/` (not plan folder)
4. Use naming: `{date}-{agent}-{slug}.md`

**Important:** Suggested plans do NOT get plan-specific reports - this prevents pollution of old plan folders.

## Quality Standards

- Be thorough and specific about strategy
- Consider brand consistency and voice
- Research thoroughly when uncertain
- Address competitive differentiation
- Make plans detailed enough for marketing team execution
- Validate against brand guidelines

**Remember:** Plan quality determines campaign success. Be comprehensive and consider all marketing aspects.


---
### Skill: marketing-ideas


# Marketing Ideas for SaaS

You are a marketing strategist with a library of 140 proven marketing ideas. Your goal is to help users find the right marketing strategies for their specific situation, stage, and resources.

## How to Use This Skill

When asked for marketing ideas:
1. Ask about their product, audience, and current stage if not clear
2. Suggest 3-5 most relevant ideas based on their context
3. Provide details on implementation for chosen ideas
4. Consider their resources (time, budget, team size)

---

## The 140 Marketing Ideas

Organized by category for easy reference.

---

## Content & SEO

### 3. Easy Keyword Ranking
Target low-competition keywords where you can rank quickly. Find terms competitors overlook—niche variations, long-tail queries, emerging topics. Build authority in micro-niches before expanding.

### 7. SEO Audit
Conduct comprehensive technical SEO audits of your own site and share findings publicly. Document fixes and improvements to build authority while improving your rankings.

### 39. Glossary Marketing
Create comprehensive glossaries defining industry terms. Each term becomes an SEO-optimized page targeting "what is X" searches, building topical authority while capturing top-of-funnel traffic.

### 40. Programmatic SEO
Build template-driven pages at scale targeting keyword patterns. Location pages, comparison pages, integration pages—any pattern with search volume can become a scalable content engine.

### 41. Content Repurposing
Transform one piece of content into multiple formats. Blog post becomes Twitter thread, YouTube video, podcast episode, infographic. Maximize ROI on content creation.

### 56. Proprietary Data Content
Leverage unique data from your product to create original research and reports. Data competitors can't replicate creates linkable, quotable assets.

### 67. Internal Linking
Strategic internal linking distributes authority and improves crawlability. Build topical clusters connecting related content to strengthen overall SEO performance.

### 73. Content Refreshing
Regularly update existing content with fresh data, examples, and insights. Refreshed content often outperforms new content and protects existing rankings.

### 74. Knowledge Base SEO
Optimize help documentation for search. Support articles targeting problem-solution queries capture users actively seeking solutions.

### 137. Parasite SEO
Publish content on high-authority platforms (Medium, LinkedIn, Substack) that rank faster than your own domain. Funnel that traffic back to your product.

---

## Competitor & Comparison

### 2. Competitor Comparison Pages
Create detailed comparison pages positioning your product against competitors. "[Your Product] vs [Competitor]" and "[Competitor] alternatives" pages capture high-intent searchers.

### 4. Marketing Jiu-Jitsu
Turn competitor weaknesses into your strengths. When competitors raise prices, launch affordability campaigns. When they have outages, emphasize your reliability.

### 38. Competitive Ad Research
Study competitor advertising through tools like SpyFu or Facebook Ad Library. Learn what messaging resonates, then improve on their approach.

---

## Free Tools & Engineering

### 5. Side Projects as Marketing
Build small, useful tools related to your main product. Side projects attract users who may later convert, generate backlinks, and showcase your capabilities.

### 30. Engineering as Marketing
Build free tools that solve real problems for your target audience. Calculators, analyzers, generators—useful utilities that naturally lead to your paid product.

### 31. Importers as Marketing
Build import tools for competitor data. "Import from [Competitor]" reduces switching friction while capturing users actively looking to leave.

### 92. Quiz Marketing
Create interactive quizzes that engage users while qualifying leads. Personality quizzes, assessments, and diagnostic tools generate shares and capture emails.

### 93. Calculator Marketing
Build calculators solving real problems—ROI calculators, pricing estimators, savings tools. Calculators attract links, rank well, and demonstrate value.

### 94. Chrome Extensions
Create browser extensions providing standalone value. Chrome Web Store becomes another distribution channel while keeping your brand in daily view.

### 110. Microsites
Build focused microsites for specific campaigns, products, or audiences. Dedicated domains can rank faster and allow bolder positioning.

### 117. Scanners
Build free scanning tools that audit or analyze something for users. Website scanners, security checkers, performance analyzers—provide value while showcasing expertise.

### 122. Public APIs
Open APIs enable developers to build on your platform, creating an ecosystem that attracts users and increases switching costs.

---

## Paid Advertising

### 18. Podcast Advertising
Sponsor relevant podcasts to reach engaged audiences. Host-read ads perform especially well due to built-in trust.

### 48. Pre-targeting Ads
Show awareness ads before launching direct response campaigns. Warm audiences convert better than cold ones.

### 55. Facebook Ads
Meta's detailed targeting reaches specific audiences. Test creative variations and leverage retargeting for users who've shown interest.

### 57. Instagram Ads
Visual-first advertising for products with strong imagery. Stories and Reels ads capture attention in native formats.

### 60. Twitter Ads
Reach engaged professionals discussing industry topics. Promoted tweets and follower campaigns build visibility.

### 62. LinkedIn Ads
Target by job title, company size, and industry. Premium CPMs justified by B2B purchase intent.

### 64. Reddit Ads
Reach passionate communities with authentic messaging. Reddit users detect inauthentic ads quickly—transparency wins.

### 66. Quora Ads
Target users actively asking questions your product answers. Intent-rich environment for educational ads.

### 68. Google Ads
Capture high-intent search queries. Brand terms protect your name; competitor terms capture switchers; category terms reach researchers.

### 70. YouTube Ads
Video ads with detailed targeting. Pre-roll and discovery ads reach users consuming related content.

### 72. Cross-Platform Retargeting
Follow users across platforms with consistent messaging. Retargeting converts window shoppers into buyers.

### 129. Click-to-Messenger Ads
Ads that open direct conversations rather than landing pages. Higher engagement through immediate dialogue.

---

## Social Media & Community

### 42. Community Marketing
Build and nurture communities around your product or industry. Slack groups, Discord servers, Facebook groups, or forums create loyal advocates.

### 43. Quora Marketing
Answer relevant questions with genuine expertise. Include product mentions where naturally appropriate.

### 76. Reddit Keyword Research
Mine Reddit for real language your audience uses. Discover pain points, objections, and desires expressed naturally.

### 82. Reddit Marketing
Participate authentically in relevant subreddits. Provide value first; promotional content fails without established credibility.

### 105. LinkedIn Audience
Build personal brands on LinkedIn for B2B reach. Thought leadership content builds authority and drives inbound interest.

### 106. Instagram Audience
Visual storytelling for products with strong aesthetics. Behind-the-scenes, user stories, and product showcases build following.

### 107. X Audience
Build presence on X/Twitter through consistent value. Threads, insights, and engagement grow followings that convert.

### 130. Short Form Video
TikTok, Reels, and Shorts reach new audiences with snackable content. Educational and entertaining short videos spread organically.

### 138. Engagement Pods
Coordinate with peers to boost each other's content engagement. Early engagement signals help content reach wider audiences.

### 139. Comment Marketing
Thoughtful comments on relevant content build visibility. Add value to discussions where your target audience pays attention.

---

## Email Marketing

### 17. Mistake Email Marketing
Send "oops" emails when something genuinely goes wrong. Authenticity and transparency often generate higher engagement than polished campaigns.

### 25. Reactivation Emails
Win back churned or inactive users with targeted campaigns. Remind them of value, share what's new, offer incentives.

### 28. Founder Welcome Email
Personal welcome emails from founders create connection. Share your story, ask about their goals, start relationships.

### 36. Dynamic Email Capture
Smart email capture that adapts to user behavior. Exit intent, scroll depth, time on page—trigger popups at the right moment.

### 79. Monthly Newsletters
Consistent newsletters keep your brand top-of-mind. Curate industry news, share insights, highlight product updates.

### 80. Inbox Placement
Technical email optimization for deliverability. Authentication, list hygiene, and engagement signals determine whether emails arrive.

### 113. Onboarding Emails
Guide new users to activation with targeted email sequences. Behavior-triggered emails outperform time-based schedules.

### 115. Win-back Emails
Re-engage churned users with compelling reasons to return. New features, improvements, or offers reignite interest.

### 116. Trial Reactivation
Expired trials aren't lost causes. Targeted campaigns highlighting new value can recover abandoned trials.

---

## Partnerships & Programs

### 9. Affiliate Discovery Through Backlinks
Find potential affiliates by analyzing who links to competitors. Sites already promoting similar products may welcome affiliate relationships.

### 27. Influencer Whitelisting
Run ads through influencer accounts for authentic reach. Whitelisting combines influencer credibility with paid targeting.

### 33. Reseller Programs
Enable agencies and service providers to resell your product. White-label options create invested distribution partners.

### 37. Expert Networks
Build networks of certified experts who implement your product. Experts extend your reach while ensuring quality implementations.

### 50. Newsletter Swaps
Exchange promotional mentions with complementary newsletters. Access each other's audiences without advertising costs.

### 51. Article Quotes
Contribute expert quotes to journalists and publications. Tools like HARO connect experts with writers seeking sources.

### 77. Pixel Sharing
Partner with complementary companies to share remarketing audiences. Expand reach through strategic data partnerships.

### 78. Shared Slack Channels
Create shared channels with partners and customers. Direct communication lines strengthen relationships.

### 97. Affiliate Program
Structured commission programs for referrers. Affiliates become motivated salespeople earning from successful referrals.

### 98. Integration Marketing
Joint marketing with integration partners. Combined audiences and shared promotion amplify reach for both products.

### 99. Community Sponsorship
Sponsor relevant communities, newsletters, or publications. Aligned sponsorships build brand awareness with target audiences.

---

## Events & Speaking

### 15. Live Webinars
Educational webinars demonstrate expertise while generating leads. Interactive formats create engagement and urgency.

### 53. Virtual Summits
Multi-speaker online events attract audiences through varied perspectives. Summit speakers promote to their audiences, amplifying reach.

### 87. Roadshows
Take your product on the road to meet customers directly. Regional events create personal connections at scale.

### 90. Local Meetups
Host or attend local meetups in key markets. In-person connections create stronger relationships than digital alone.

### 91. Meetup Sponsorship
Sponsor relevant meetups to reach engaged local audiences. Food, venue, or swag sponsorships generate goodwill.

### 103. Conference Speaking
Speak at industry conferences to reach engaged audiences. Presentations showcase expertise while generating leads.

### 126. Conferences
Host your own conference to become the center of your industry. User conferences strengthen communities and generate content.

### 132. Conference Sponsorship
Sponsor relevant conferences for brand visibility. Booth presence, speaking slots, and attendee lists justify investment.

---

## PR & Media

### 8. Media Acquisitions as Marketing
Acquire newsletters, podcasts, or publications in your space. Owned media provides direct access to engaged audiences.

### 52. Press Coverage
Pitch newsworthy stories to relevant publications. Launches, funding, data, and trends create press opportunities.

### 84. Fundraising PR
Leverage funding announcements for press coverage. Rounds signal validation and create natural news hooks.

### 118. Documentaries
Create documentary content exploring your industry or customers. Long-form storytelling builds deep connection and differentiation.

---

## Launches & Promotions

### 21. Black Friday Promotions
Annual deals create urgency and acquisition spikes. Promotional periods capture deal-seekers who become long-term customers.

### 22. Product Hunt Launch
Structured Product Hunt launches reach early adopters. Preparation, timing, and community engagement drive successful launches.

### 23. Early-Access Referrals
Reward referrals with earlier access during launches. Waitlist referral programs create viral anticipation.

### 44. New Year Promotions
New Year brings fresh budgets and goal-setting energy. Promotional timing aligned with renewal mindsets increases conversion.

### 54. Early Access Pricing
Launch with discounted early access tiers. Early supporters get deals while you build testimonials and feedback.

### 58. Product Hunt Alternatives
Launch on alternatives to Product Hunt—BetaList, Launching Next, AlternativeTo. Multiple launch platforms expand reach.

### 59. Twitter Giveaways
Engagement-boosting giveaways that require follows, retweets, or tags. Giveaways grow following while generating buzz.

### 109. Giveaways
Strategic giveaways attract attention and capture leads. Product giveaways, partner prizes, or experience rewards create engagement.

### 119. Vacation Giveaways
Grand prize giveaways generate massive engagement. Dream vacation packages motivate sharing and participation.

### 140. Lifetime Deals
One-time payment deals generate cash and users. Lifetime deal platforms reach deal-hunting audiences willing to pay upfront.

---

## Product-Led Growth

### 16. Powered By Marketing
"Powered by [Your Product]" badges on customer output create free impressions. Every customer becomes a marketing channel.

### 19. Free Migrations
Offer free migration services from competitors. Reduce switching friction while capturing users ready to leave.

### 20. Contract Buyouts
Pay to exit competitor contracts. Dramatic commitment removes the final barrier for locked-in prospects.

### 32. One-Click Registration
Minimize signup friction with one-click OAuth options. Pre-filled forms and instant access increase conversion.

### 69. In-App Upsells
Strategic upgrade prompts within the product experience. Contextual upsells at usage limits or feature attempts convert best.

### 71. Newsletter Referrals
Built-in referral programs for newsletters and content. Easy sharing mechanisms turn subscribers into promoters.

### 75. Viral Loops
Product mechanics that naturally encourage sharing. Collaboration features, public outputs, or referral incentives create organic growth.

### 114. Offboarding Flows
Optimize cancellation flows to retain or learn. Exit surveys, save offers, and pause options reduce churn.

### 124. Concierge Setup
White-glove onboarding for high-value accounts. Personal setup assistance increases activation and retention.

### 127. Onboarding Optimization
Continuous improvement of the new user experience. Faster time-to-value increases conversion and retention.

---

## Content Formats

### 1. Playlists as Marketing
Create Spotify playlists for your audience—productivity playlists, work music, industry-themed collections. Daily listening touchpoints build brand affinity.

### 46. Template Marketing
Offer free templates users can immediately use. Templates in your product create habit and dependency while showcasing capabilities.

### 49. Graphic Novel Marketing
Transform complex stories into visual narratives. Graphic novels stand out and make abstract concepts tangible.

### 65. Promo Videos
High-quality promotional videos showcase your product professionally. Invest in production value for shareable, memorable content.

### 81. Industry Interviews
Interview customers, experts, and thought leaders. Interview content builds relationships while creating valuable assets.

### 89. Social Screenshots
Design shareable screenshot templates for social proof. Make it easy for customers to share wins and testimonials.

### 101. Online Courses
Educational courses establish authority while generating leads. Free courses attract learners; paid courses create revenue.

### 102. Book Marketing
Author a book establishing expertise in your domain. Books create credibility, speaking opportunities, and media coverage.

### 111. Annual Reports
Publish annual reports showcasing industry data and trends. Original research becomes a linkable, quotable reference.

### 120. End of Year Wraps
Personalized year-end summaries users want to share. "Spotify Wrapped" style reports turn data into social content.

### 121. Podcasts
Launch a podcast reaching audiences during commutes and workouts. Regular audio content builds intimate audience relationships.

### 63. Changelogs
Public changelogs showcase product momentum. Regular updates demonstrate active development and responsiveness.

### 112. Public Demos
Live product demonstrations showing real usage. Transparent demos build trust and answer questions in real-time.

---

## Unconventional & Creative

### 6. Awards as Marketing
Create industry awards positioning your brand as tastemaker. Award programs attract applications, sponsors, and press coverage.

### 10. Challenges as Marketing
Launch viral challenges that spread organically. Creative challenges generate user content and social sharing.

### 11. Reality TV Marketing
Create reality-show style content following real customers. Documentary competition formats create engaging narratives.

### 12. Controversy as Marketing
Strategic positioning against industry norms. Contrarian takes generate attention and discussion.

### 13. Moneyball Marketing
Data-driven marketing finding undervalued channels and tactics. Analytics identify opportunities competitors overlook.

### 14. Curation as Marketing
Curate valuable resources for your audience. Directories, lists, and collections provide value while building authority.

### 29. Grants as Marketing
Offer grants to customers or community members. Grant programs generate applications, PR, and goodwill.

### 34. Product Competitions
Sponsor competitions using your product. Hackathons, design contests, and challenges showcase capabilities while engaging users.

### 35. Cameo Marketing
Use Cameo celebrities for personalized marketing messages. Unexpected celebrity endorsements generate buzz and shares.

### 83. OOH Advertising
Out-of-home advertising—billboards, transit ads, and placements. Physical presence in key locations builds brand awareness.

### 125. Marketing Stunts
Bold, attention-grabbing marketing moments. Well-executed stunts generate press coverage and social sharing.

### 128. Guerrilla Marketing
Unconventional, low-cost marketing in unexpected places. Creative guerrilla tactics stand out from traditional advertising.

### 136. Humor Marketing
Use humor to stand out and create memorability. Funny content gets shared and builds brand personality.

---

## Platforms & Marketplaces

### 24. Open Source as Marketing
Open-source components or tools build developer goodwill. Open source creates community, contributions, and credibility.

### 61. App Store Optimization
Optimize app store listings for discoverability. Keywords, screenshots, and reviews drive organic app installs.

### 86. App Marketplaces
List in relevant app marketplaces and directories. Salesforce AppExchange, Shopify App Store, and similar platforms provide distribution.

### 95. YouTube Reviews
Get YouTubers to review your product. Authentic reviews reach engaged audiences and create lasting content.

### 96. YouTube Channel
Build a YouTube presence with tutorials, updates, and thought leadership. Video content compounds in value over time.

### 108. Source Platforms
Submit to platforms that aggregate tools and products. G2, Capterra, GetApp, and similar directories drive discovery.

### 88. Review Sites
Actively manage presence on review platforms. Reviews influence purchase decisions; actively request and respond to them.

### 100. Live Audio
Host live audio discussions on Twitter Spaces, Clubhouse, or LinkedIn Audio. Real-time conversation creates intimate engagement.

---

## International & Localization

### 133. International Expansion
Expand to new geographic markets. Localization, partnerships, and regional marketing unlock new growth.

### 134. Price Localization
Adjust pricing for local purchasing power. Localized pricing increases conversion in price-sensitive markets.

---

## Developer & Technical

### 104. Investor Marketing
Market to investors for downstream portfolio introductions. Investors recommend tools to their portfolio companies.

### 123. Certifications
Create certification programs validating expertise. Certifications create invested advocates while generating training revenue.

### 131. Support as Marketing
Turn support interactions into marketing opportunities. Exceptional support creates stories customers share.

### 135. Developer Relations
Build relationships with developer communities. DevRel creates advocates who recommend your product to peers.

---

## Audience-Specific

### 26. Two-Sided Referrals
Reward both referrer and referred in referral programs. Dual incentives motivate sharing while welcoming new users.

### 45. Podcast Tours
Guest on multiple podcasts reaching your target audience. Podcast tours create compounding awareness across shows.

### 47. Customer Language
Use the exact words your customers use. Mining reviews, support tickets, and interviews for language that resonates.

---

## Implementation Tips

When suggesting ideas, consider:

**By Stage:**
- Pre-launch: Waitlist referrals, early access, Product Hunt prep
- Early stage: Content, SEO, community, founder-led sales
- Growth stage: Paid acquisition, partnerships, events
- Scale: Brand, international, acquisitions

**By Budget:**
- Free: Content, SEO, community, social media
- Low budget: Targeted ads, sponsorships, tools
- Medium budget: Events, partnerships, PR
- High budget: Acquisitions, conferences, brand campaigns

**By Timeline:**
- Quick wins: Ads, email, social posts
- Medium-term: Content, SEO, community building
- Long-term: Brand, thought leadership, platform effects

---

## Questions to Ask

If you need more context:
1. What's your product and who's your target customer?
2. What's your current stage and main growth goal?
3. What's your marketing budget and team size?
4. What have you already tried that worked or didn't?
5. What are your competitors doing that you admire or want to counter?

---

## Output Format

When recommending ideas:

**For each recommended idea:**
- **Idea name**: One-line description
- **Why it fits**: Connection to their situation
- **How to start**: First 2-3 implementation steps
- **Expected outcome**: What success looks like
- **Resources needed**: Time, budget, skills required

---

## Related Skills

- **programmatic-seo**: For scaling SEO content (#40)
- **competitor**: For comparison pages (#2)
- **email-sequence**: For email marketing tactics
- **free-tool-strategy**: For engineering as marketing (#30)
- **page-cro**: For landing page optimization
- **ab-test-setup**: For testing marketing experiments

---
### Skill: marketing-dashboard


# Marketing Dashboard

**Status:** Foundation Phase (Phase 1 Complete)

Local-first marketing command center for solopreneurs. Manage campaigns, content, and assets with Claude Code AI automation.

## Quick Start

### Development Mode

```bash
# Terminal 1: Start API server
cd .opencode/skills/marketing-dashboard/server
npm run dev

# Terminal 2: Start Vue frontend
cd .opencode/skills/marketing-dashboard/app
npm run dev
```

Access:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3457

### Production Mode

```bash
# Build frontend
cd .opencode/skills/marketing-dashboard/app
npm run build

# Start server (serves API + built frontend)
cd ../server
npm start
```

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3 + Vite + Tailwind CSS |
| Backend | Hono (Node.js) |
| Database | SQLite (better-sqlite3) |
| AI | Claude Code CLI |

## Phase 1 Complete ✓

- [x] Vue 3 + Vite app initialized
- [x] Tailwind CSS configured with design tokens
- [x] Hono API server created
- [x] SQLite database schema defined
- [x] Basic API endpoints (GET)

## Next Phases

- **Phase 2:** Full CRUD API routes
- **Phase 3:** Vue components & stores
- **Phase 4:** Dashboard features
- **Phase 5:** Integration & deployment

## Database Tables

- `campaigns` - Marketing campaigns
- `content` - Blog posts, social media, emails
- `assets` - Images, videos, documents
- `automations` - AI automation recipes

## Commands

```bash
# Start dashboard
/marketing:dashboard

# Or manually:
node .opencode/skills/marketing-dashboard/server/index.js
```

---
### Skill: campaign


# Campaign

End-to-end campaign planning, execution, and optimization.

<args>$ARGUMENTS</args>

## When to Use

- Campaign planning and launch execution
- Multi-channel coordination
- Budget allocation and timeline management
- Performance tracking and optimization
- Email campaign management

## Campaign Types

Product Launch, Seasonal/Promotional, Brand Awareness, Lead Generation, Re-engagement

## Workflow

1. **Parse Arguments** — extract action + campaign name from `$ARGUMENTS`
2. **Route to Action:**
   - `create`: Gather requirements → `campaign-manager` agent → `funnel-architect` agent → output to `assets/campaigns/`
   - `status`: Read campaign files → `analytics-analyst` agent → display progress
   - `analyze`: `analytics-analyst` + `campaign-debugger` agents → generate report
   - `email`: Email campaign creation and management

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `analyze` | Analyze campaign performance | `references/analyze.md` |
| `create` | Create comprehensive digital marketing campaign | `references/create.md` |
| `email` | Email campaign management | `references/email.md` |
| `status` | Get campaign status | `references/status.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| Campaign Brief | `references/campaign-brief.md` |
| Launch Checklist | `references/launch-checklist.md` |
| Budget Allocation | `references/budget-allocation.md` |
| Optimization Framework | `references/optimization-framework.md` |

## Agents Used

- `campaign-manager` — Campaign orchestration
- `funnel-architect` — Funnel design
- `analytics-analyst` — Performance tracking
- `campaign-debugger` — Issue diagnosis

## Output

- Campaign briefs → `assets/campaigns/{date}-{slug}/briefs/`
- Campaign creatives → `assets/campaigns/{date}-{slug}/creatives/`
- Campaign reports → `assets/campaigns/{date}-{slug}/reports/`
- Analysis reports → `assets/diagnostics/campaign-audits/{date}-{name}.md`

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments

---
### Skill: content-hub


# Content Hub

Visual asset gallery for ClaudeKit Marketing.

## Quick Start

```bash
# Open gallery
node .opencode/skills/content-hub/scripts/server.cjs --open

# Rescan assets
node .opencode/skills/content-hub/scripts/server.cjs --scan

# Stop server
node .opencode/skills/content-hub/scripts/server.cjs --stop
```

Or use command: `/write:hub`

## Features

- **Gallery Grid**: Thumbnails of assets/ folder
- **Filter/Search**: By type (banners, designs, etc.) and keywords
- **Brand Sidebar**: Displays user's colors and voice from docs/brand-guidelines.md
- **Actions**: Preview, Edit in Claude, Copy path, Generate new
- **R2 Ready**: Manifest schema supports Cloudflare R2 sync (UI disabled)

## API Routes

| Route | Purpose |
|-------|---------|
| `/hub` | Gallery HTML |
| `/api/assets` | Asset list JSON |
| `/api/brand` | Brand context JSON |
| `/api/scan` | Trigger rescan |
| `/file/*` | Serve local files |

## Manifest Schema

Assets stored in `.assets/manifest.json` with R2 fields:

```json
{
  "id": "abc123",
  "path": "banners/hero.png",
  "category": "banner",
  "r2": {
    "status": "local",  // local|pending|synced|error
    "bucket": null,
    "url": null
  }
}
```

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/server.cjs` | HTTP server entry |
| `scripts/lib/scanner.cjs` | Scan assets directory |
| `scripts/lib/router.cjs` | HTTP routing |
| `scripts/lib/brand-context.cjs` | Extract brand guidelines |

## Integration

**Command**: `/write:hub`

**Related Skills**: brand, ai-multimodal, design

**Agents**: content-creator, ui-ux-designer

---
