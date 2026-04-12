---
name: technical-bundle
description: Combined Technical skills for Manus AI
---

## Technical Super-Skill Bundle

### Skill: docs-seeker


# Documentation Discovery via Scripts

## Overview

**Script-first** documentation discovery using llms.txt standard.

Execute scripts to handle entire workflow - no manual URL construction needed.

## Primary Workflow

**ALWAYS execute scripts in this order:**

```bash
# 1. DETECT query type (topic-specific vs general)
node scripts/detect-topic.js "<user query>"

# 2. FETCH documentation using script output
node scripts/fetch-docs.js "<user query>"

# 3. ANALYZE results (if multiple URLs returned)
cat llms.txt | node scripts/analyze-llms-txt.js -
```

Scripts handle URL construction, fallback chains, and error handling automatically.

## Scripts

**`detect-topic.js`** - Classify query type
- Identifies topic-specific vs general queries
- Extracts library name + topic keyword
- Returns JSON: `{topic, library, isTopicSpecific}`
- Zero-token execution

**`fetch-docs.js`** - Retrieve documentation
- Constructs context7.com URLs automatically
- Handles fallback: topic → general → error
- Outputs llms.txt content or error message
- Zero-token execution

**`analyze-llms-txt.js`** - Process llms.txt
- Categorizes URLs (critical/important/supplementary)
- Recommends agent distribution (1 agent, 3 agents, 7 agents, phased)
- Returns JSON with strategy
- Zero-token execution

## Workflow References

**[Topic-Specific Search](./workflows/topic-search.md)** - Fastest path (10-15s)

**[General Library Search](./workflows/library-search.md)** - Comprehensive coverage (30-60s)

**[Repository Analysis](./workflows/repo-analysis.md)** - Fallback strategy

## References

**[context7-patterns.md](./references/context7-patterns.md)** - URL patterns, known repositories

**[errors.md](./references/errors.md)** - Error handling, fallback strategies

**[advanced.md](./references/advanced.md)** - Edge cases, versioning, multi-language

## Execution Principles

1. **Scripts first** - Execute scripts instead of manual URL construction
2. **Zero-token overhead** - Scripts run without context loading
3. **Automatic fallback** - Scripts handle topic → general → error chains
4. **Progressive disclosure** - Load workflows/references only when needed
5. **Agent distribution** - Scripts recommend parallel agent strategy

## Quick Start

**Topic query:** "How do I use date picker in shadcn?"
```bash
node scripts/detect-topic.js "<query>"  # → {topic, library, isTopicSpecific}
node scripts/fetch-docs.js "<query>"    # → 2-3 URLs
# Read URLs with WebFetch
```

**General query:** "Documentation for Next.js"
```bash
node scripts/detect-topic.js "<query>"         # → {isTopicSpecific: false}
node scripts/fetch-docs.js "<query>"           # → 8+ URLs
cat llms.txt | node scripts/analyze-llms-txt.js -  # → {totalUrls, distribution}
# Deploy agents per recommendation
```

## Environment

Scripts load `.env`: `process.env` > `.opencode/skills/docs-seeker/.env` > `.opencode/skills/.env` > `.opencode/.env`

See `.env.example` for configuration options.

---
### Skill: sequential-thinking


# Sequential Thinking

Structured problem-solving via manageable, reflective thought sequences with dynamic adjustment.

## When to Apply

- Complex problem decomposition
- Adaptive planning with revision capability
- Analysis needing course correction
- Problems with unclear/emerging scope
- Multi-step solutions requiring context maintenance
- Hypothesis-driven investigation/debugging

## Core Process

### 1. Start with Loose Estimate
```
Thought 1/5: [Initial analysis]
```
Adjust dynamically as understanding evolves.

### 2. Structure Each Thought
- Build on previous context explicitly
- Address one aspect per thought
- State assumptions, uncertainties, realizations
- Signal what next thought should address

### 3. Apply Dynamic Adjustment
- **Expand**: More complexity discovered → increase total
- **Contract**: Simpler than expected → decrease total
- **Revise**: New insight invalidates previous → mark revision
- **Branch**: Multiple approaches → explore alternatives

### 4. Use Revision When Needed
```
Thought 5/8 [REVISION of Thought 2]: [Corrected understanding]
- Original: [What was stated]
- Why revised: [New insight]
- Impact: [What changes]
```

### 5. Branch for Alternatives
```
Thought 4/7 [BRANCH A from Thought 2]: [Approach A]
Thought 4/7 [BRANCH B from Thought 2]: [Approach B]
```
Compare explicitly, converge with decision rationale.

### 6. Generate & Verify Hypotheses
```
Thought 6/9 [HYPOTHESIS]: [Proposed solution]
Thought 7/9 [VERIFICATION]: [Test results]
```
Iterate until hypothesis verified.

### 7. Complete Only When Ready
Mark final: `Thought N/N [FINAL]`

Complete when:
- Solution verified
- All critical aspects addressed
- Confidence achieved
- No outstanding uncertainties

## Application Modes

**Explicit**: Use visible thought markers when complexity warrants visible reasoning or user requests breakdown.

**Implicit**: Apply methodology internally for routine problem-solving where thinking aids accuracy without cluttering response.

## Scripts (Optional)

Optional scripts for deterministic validation/tracking:
- `scripts/process-thought.js` - Validate & track thoughts with history
- `scripts/format-thought.js` - Format for display (box/markdown/simple)

See README.md for usage examples. Use when validation/persistence needed; otherwise apply methodology directly.

## References

Load when deeper understanding needed:
- `references/core-patterns.md` - Revision & branching patterns
- `references/examples-api.md` - API design example
- `references/examples-debug.md` - Debugging example
- `references/examples-architecture.md` - Architecture decision example
- `references/advanced-techniques.md` - Spiral refinement, hypothesis testing, convergence
- `references/advanced-strategies.md` - Uncertainty, revision cascades, meta-thinking

---
### Skill: brainstorm


# Brainstorming Skill

You are a Solution Brainstormer, an elite software engineering expert who specializes in system architecture design and technical decision-making. Your core mission is to collaborate with users to find the best possible solutions while maintaining brutal honesty about feasibility and trade-offs.

## Communication Style
If coding level guidelines were injected at session start (levels 0-5), follow those guidelines for response structure and explanation depth. The guidelines define what to explain, what not to explain, and required response format.

## Core Principles
You operate by the holy trinity of software engineering: **YAGNI** (You Aren't Gonna Need It), **KISS** (Keep It Simple, Stupid), and **DRY** (Don't Repeat Yourself). Every solution you propose must honor these principles.

## Your Expertise
- System architecture design and scalability patterns
- Risk assessment and mitigation strategies
- Development time optimization and resource allocation
- User Experience (UX) and Developer Experience (DX) optimization
- Technical debt management and maintainability
- Performance optimization and bottleneck identification

## Your Approach
1. **Question Everything**: Use `AskUserQuestion` tool to ask probing questions to fully understand the user's request, constraints, and true objectives. Don't assume - clarify until you're 100% certain.
2. **Brutal Honesty**: Use `AskUserQuestion` tool to provide frank, unfiltered feedback about ideas. If something is unrealistic, over-engineered, or likely to cause problems, say so directly. Your job is to prevent costly mistakes.
3. **Explore Alternatives**: Always consider multiple approaches. Present 2-3 viable solutions with clear pros/cons, explaining why one might be superior.
4. **Challenge Assumptions**: Use `AskUserQuestion` tool to question the user's initial approach. Often the best solution is different from what was originally envisioned.
5. **Consider All Stakeholders**: Use `AskUserQuestion` tool to evaluate impact on end users, developers, operations team, and business objectives.

## Collaboration Tools
- Consult the `planner` agent to research industry best practices and find proven solutions
- Engage the `docs-manager` agent to understand existing project implementation and constraints
- Use `WebSearch` tool to find efficient approaches and learn from others' experiences
- Use `docs-seeker` skill to read latest documentation of external plugins/packages
- Leverage `ai-multimodal` skill to analyze visual materials and mockups
- Query `psql` command to understand current database structure and existing data
- Employ `sequential-thinking` skill for complex problem-solving that requires structured analysis

## Your Process
1. **Scout Phase**: Use `scout` skill to discover relevant files and code patterns, read relevant docs in `<project-dir>/docs` directory, to understand the current state of the project
2. **Discovery Phase**: Use `AskUserQuestion` tool to ask clarifying questions about requirements, constraints, timeline, and success criteria
3. **Research Phase**: Gather information from other agents and external sources
4. **Analysis Phase**: Evaluate multiple approaches using your expertise and principles
5. **Debate Phase**: Use `AskUserQuestion` tool to Present options, challenge user preferences, and work toward the optimal solution
6. **Consensus Phase**: Ensure alignment on the chosen approach and document decisions
7. **Documentation Phase**: Create a comprehensive markdown summary report with the final agreed solution
8. **Finalize Phase**: Use `AskUserQuestion` tool to ask if user wants to create a detailed implementation plan.
   - If `Yes`: Run `/plan` command with the brainstorm summary context as the argument to ensure plan continuity.
     **CRITICAL:** The invoked plan command will create `plan.md` with YAML frontmatter including `status: pending`.
   - If `No`: End the session.

## Report Output
Use the naming pattern from the `## Naming` section in the injected context. The pattern includes the full path and computed date.

## Output Requirements
When brainstorming concludes with agreement, create a detailed markdown summary report including:
- Problem statement and requirements
- Evaluated approaches with pros/cons
- Final recommended solution with rationale
- Implementation considerations and risks
- Success metrics and validation criteria
- Next steps and dependencies
* **IMPORTANT:** Sacrifice grammar for the sake of concision when writing outputs.

## Critical Constraints
- You DO NOT implement solutions yourself - you only brainstorm and advise
- You must validate feasibility before endorsing any approach
- You prioritize long-term maintainability over short-term convenience
- You consider both technical excellence and business pragmatism

**Remember:** Your role is to be the user's most trusted technical advisor - someone who will tell them hard truths to ensure they build something great, maintainable, and successful.

**IMPORTANT:** **DO NOT** implement anything, just brainstorm, answer questions and advise.
---
### Skill: debugging


# Debugging

Comprehensive debugging framework combining systematic investigation, root cause tracing, defense-in-depth validation, and verification protocols.

## Core Principle

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

Random fixes waste time and create new bugs. Find the root cause, fix at source, validate at every layer, verify before claiming success.

## When to Use

**Always use for:** Test failures, bugs, unexpected behavior, performance issues, build failures, integration problems, before claiming work complete

**Especially when:** Under time pressure, "quick fix" seems obvious, tried multiple fixes, don't fully understand issue, about to claim success

## The Four Techniques

### 1. Systematic Debugging (`references/systematic-debugging.md`)

Four-phase framework ensuring proper investigation:
- Phase 1: Root Cause Investigation (read errors, reproduce, check changes, gather evidence)
- Phase 2: Pattern Analysis (find working examples, compare, identify differences)
- Phase 3: Hypothesis and Testing (form theory, test minimally, verify)
- Phase 4: Implementation (create test, fix once, verify)

**Key rule:** Complete each phase before proceeding. No fixes without Phase 1.

**Load when:** Any bug/issue requiring investigation and fix

### 2. Root Cause Tracing (`references/root-cause-tracing.md`)

Trace bugs backward through call stack to find original trigger.

**Technique:** When error appears deep in execution, trace backward level-by-level until finding source where invalid data originated. Fix at source, not at symptom.

**Includes:** `scripts/find-polluter.sh` for bisecting test pollution

**Load when:** Error deep in call stack, unclear where invalid data originated

### 3. Defense-in-Depth (`references/defense-in-depth.md`)

Validate at every layer data passes through. Make bugs impossible.

**Four layers:** Entry validation → Business logic → Environment guards → Debug instrumentation

**Load when:** After finding root cause, need to add comprehensive validation

### 4. Verification (`references/verification.md`)

Run verification commands and confirm output before claiming success.

**Iron law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

Run the command. Read the output. Then claim the result.

**Load when:** About to claim work complete, fixed, or passing

## Quick Reference

```
Bug → systematic-debugging.md (Phase 1-4)
  Error deep in stack? → root-cause-tracing.md (trace backward)
  Found root cause? → defense-in-depth.md (add layers)
  About to claim success? → verification.md (verify first)
```

## Red Flags

Stop and follow process if thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "It's probably X, let me fix that"
- "Should work now" / "Seems fixed"
- "Tests pass, we're done"

**All mean:** Return to systematic process.

---
### Skill: fix


# Fixing

Unified skill for fixing issues of any complexity with intelligent routing.

## Step 0: Mode Selection

**First action:** If there is no "auto" keyword in the request, use `AskUserQuestion` to determine workflow mode:

| Option | Recommend When | Behavior |
|--------|----------------|----------|
| **Autonomous** | Simple/moderate issues | Auto-approve if score >= 9.5 & 0 critical |
| **Human-in-the-loop** | Critical/production code | Pause for approval at each step |
| **Quick** | Type errors, lint, trivial bugs | Fast debug → fix → review cycle |

See `references/mode-selection.md` for AskUserQuestion format.

## Step 1: Complexity Assessment

Classify before routing. See `references/complexity-assessment.md`.

| Level | Indicators | Workflow |
|-------|------------|----------|
| **Simple** | Single file, clear error, type/lint | `references/workflow-quick.md` |
| **Moderate** | Multi-file, root cause unclear | `references/workflow-standard.md` |
| **Complex** | System-wide, architecture impact | `references/workflow-deep.md` |
| **Parallel** | 2+ independent issues | Parallel `fullstack-developer` agents |

## Skill/Subagent Activation Matrix

See `references/skill-activation-matrix.md` for complete matrix.

**Always activate:** `debugging` (all workflows)
**Conditional:** `problem-solving`, `sequential-thinking`, `brainstorming`, `context-engineering`
**Subagents:** `debugger`, `researcher`, `planner`, `code-reviewer`, `tester`, `Bash`
**Parallel:** Multiple `Explore` agents for scouting, `Bash` agents for verification

## Output Format

Unified step markers:
```
✓ Step 0: [Mode] selected - [Complexity] detected
✓ Step 1: Root cause identified - [summary]
✓ Step 2: Fix implemented - [N] files changed
✓ Step 3: Tests [X/X passed]
✓ Step 4: Review [score]/10 - [status]
✓ Step 5: Complete - [action taken]
```

## References

Load as needed:
- `references/mode-selection.md` - AskUserQuestion format for mode
- `references/complexity-assessment.md` - Classification criteria
- `references/workflow-quick.md` - Quick: debug → fix → review
- `references/workflow-standard.md` - Standard: full pipeline
- `references/workflow-deep.md` - Deep: research + brainstorm + plan
- `references/review-cycle.md` - Review logic (autonomous vs HITL)
- `references/skill-activation-matrix.md` - When to activate each skill
- `references/parallel-exploration.md` - Parallel Explore/Bash subagents patterns

**Specialized Workflows:**
- `references/workflow-ci.md` - GitHub Actions/CI failures
- `references/workflow-logs.md` - Application log analysis
- `references/workflow-test.md` - Test suite failures
- `references/workflow-types.md` - TypeScript type errors
- `references/workflow-ui.md` - Visual/UI issues (requires design skills)

---
### Skill: scout


# Scout

Fast, token-efficient codebase scouting using parallel agents to find files needed for tasks.

## Arguments
- Default: Scout using built-in Explore subagents in parallel (`./references/internal-scouting.md`)
- `ext`: Scout using external Gemini/OpenCode CLI tools in parallel (`./references/external-scouting.md`)

## When to Use

- Beginning work on feature spanning multiple directories
- User mentions needing to "find", "locate", or "search for" files
- Starting debugging session requiring file relationships understanding
- User asks about project structure or where functionality lives
- Before changes that might affect multiple codebase parts

## Quick Start

1. Analyze user prompt to identify search targets
2. Use a wide range of Grep and Glob patterns to find relevant files and estimate scale of the codebase
3. Spawn parallel agents with divided directories
4. Collect results into concise report

## Configuration

Read from `.opencode/.ck.json`:
- `gemini.model` - Gemini model (default: `gemini-3-flash-preview`)

## Workflow

### 1. Analyze Task
- Parse user prompt for search targets
- Identify key directories, patterns, file types, lines of code
- Determine optimal SCALE value of subagents to spawn

### 2. Divide and Conquer
- Split codebase into logical segments per agent
- Assign each agent specific directories or patterns
- Ensure no overlap, maximize coverage

### 3. Spawn Parallel Agents
Load appropriate reference based on decision tree:
- **Internal (Default):** `references/internal-scouting.md` (Explore subagents)
- **External:** `references/external-scouting.md` (Gemini/OpenCode)

**Notes:**
- Prompt detailed instructions for each subagent with exact directories or files it should read
- Remember that each subagent has less than 200K tokens of context window
- Amount of subagents to-be-spawned depends on the current system resources available and amount of files to be scanned
- Each subagent must return a detailed summary report to a main agent

### 4. Collect Results
- Timeout: 3 minutes per agent (skip non-responders)
- Aggregate findings into single report
- List unresolved questions at end

## Report Format

```markdown
# Scout Report

## Relevant Files
- `path/to/file.ts` - Brief description
- ...

## Unresolved Questions
- Any gaps in findings
```

## References

- `references/internal-scouting.md` - Using Explore subagents
- `references/external-scouting.md` - Using Gemini/OpenCode CLI

---
### Skill: context-engineering


# Context Engineering

Context engineering curates the smallest high-signal token set for LLM tasks. The goal: maximize reasoning quality while minimizing token usage.

## When to Activate

- Designing/debugging agent systems
- Context limits constrain performance
- Optimizing cost/latency
- Building multi-agent coordination
- Implementing memory systems
- Evaluating agent performance
- Developing LLM-powered pipelines

## Core Principles

1. **Context quality > quantity** - High-signal tokens beat exhaustive content
2. **Attention is finite** - U-shaped curve favors beginning/end positions
3. **Progressive disclosure** - Load information just-in-time
4. **Isolation prevents degradation** - Partition work across sub-agents
5. **Measure before optimizing** - Know your baseline

**IMPORTANT:**
- Sacrifice grammar for the sake of concision.
- Ensure token efficiency while maintaining high quality.
- Pass these rules to subagents.

## Quick Reference

| Topic | When to Use | Reference |
|-------|-------------|-----------|
| **Fundamentals** | Understanding context anatomy, attention mechanics | [context-fundamentals.md](./references/context-fundamentals.md) |
| **Degradation** | Debugging failures, lost-in-middle, poisoning | [context-degradation.md](./references/context-degradation.md) |
| **Optimization** | Compaction, masking, caching, partitioning | [context-optimization.md](./references/context-optimization.md) |
| **Compression** | Long sessions, summarization strategies | [context-compression.md](./references/context-compression.md) |
| **Memory** | Cross-session persistence, knowledge graphs | [memory-systems.md](./references/memory-systems.md) |
| **Multi-Agent** | Coordination patterns, context isolation | [multi-agent-patterns.md](./references/multi-agent-patterns.md) |
| **Evaluation** | Testing agents, LLM-as-Judge, metrics | [evaluation.md](./references/evaluation.md) |
| **Tool Design** | Tool consolidation, description engineering | [tool-design.md](./references/tool-design.md) |
| **Pipelines** | Project development, batch processing | [project-development.md](./references/project-development.md) |
| **Runtime Awareness** | Usage limits, context window monitoring | [runtime-awareness.md](./references/runtime-awareness.md) |

## Key Metrics

- **Token utilization**: Warning at 70%, trigger optimization at 80%
- **Token variance**: Explains 80% of agent performance variance
- **Multi-agent cost**: ~15x single agent baseline
- **Compaction target**: 50-70% reduction, <5% quality loss
- **Cache hit target**: 70%+ for stable workloads

## Four-Bucket Strategy

1. **Write**: Save context externally (scratchpads, files)
2. **Select**: Pull only relevant context (retrieval, filtering)
3. **Compress**: Reduce tokens while preserving info (summarization)
4. **Isolate**: Split across sub-agents (partitioning)

## Anti-Patterns

- Exhaustive context over curated context
- Critical info in middle positions
- No compaction triggers before limits
- Single agent for parallelizable tasks
- Tools without clear descriptions

## Guidelines

1. Place critical info at beginning/end of context
2. Implement compaction at 70-80% utilization
3. Use sub-agents for context isolation, not role-play
4. Design tools with 4-question framework (what, when, inputs, returns)
5. Optimize for tokens-per-task, not tokens-per-request
6. Validate with probe-based evaluation
7. Monitor KV-cache hit rates in production
8. Start minimal, add complexity only when proven necessary

## Runtime Awareness

The system automatically injects usage awareness via PostToolUse hook:

```xml
<usage-awareness>
Claude Usage Limits: 5h=45%, 7d=32%
Context Window Usage: 67%
</usage-awareness>
```

**Thresholds:**
- 70%: WARNING - consider optimization/compaction
- 90%: CRITICAL - immediate action needed

**Data Sources:**
- Usage limits: Anthropic OAuth API (`https://api.anthropic.com/api/oauth/usage`)
- Context window: Statusline temp file (`/tmp/ck-context-{session_id}.json`)

## Scripts

- [context_analyzer.py](./scripts/context_analyzer.py) - Context health analysis, degradation detection
- [compression_evaluator.py](./scripts/compression_evaluator.py) - Compression quality evaluation

---
### Skill: mcp-builder


# MCP Server Development Guide

## Overview

To create high-quality MCP (Model Context Protocol) servers that enable LLMs to effectively interact with external services, use this skill. An MCP server provides tools that allow LLMs to access external services and APIs. The quality of an MCP server is measured by how well it enables LLMs to accomplish real-world tasks using the tools provided.

---

# Process

## 🚀 High-Level Workflow

Creating a high-quality MCP server involves four main phases:

### Phase 1: Deep Research and Planning

#### 1.1 Understand Agent-Centric Design Principles

Before diving into implementation, understand how to design tools for AI agents by reviewing these principles:

**Build for Workflows, Not Just API Endpoints:**
- Don't simply wrap existing API endpoints - build thoughtful, high-impact workflow tools
- Consolidate related operations (e.g., `schedule_event` that both checks availability and creates event)
- Focus on tools that enable complete tasks, not just individual API calls
- Consider what workflows agents actually need to accomplish

**Optimize for Limited Context:**
- Agents have constrained context windows - make every token count
- Return high-signal information, not exhaustive data dumps
- Provide "concise" vs "detailed" response format options
- Default to human-readable identifiers over technical codes (names over IDs)
- Consider the agent's context budget as a scarce resource

**Design Actionable Error Messages:**
- Error messages should guide agents toward correct usage patterns
- Suggest specific next steps: "Try using filter='active_only' to reduce results"
- Make errors educational, not just diagnostic
- Help agents learn proper tool usage through clear feedback

**Follow Natural Task Subdivisions:**
- Tool names should reflect how humans think about tasks
- Group related tools with consistent prefixes for discoverability
- Design tools around natural workflows, not just API structure

**Use Evaluation-Driven Development:**
- Create realistic evaluation scenarios early
- Let agent feedback drive tool improvements
- Prototype quickly and iterate based on actual agent performance

#### 1.3 Study MCP Protocol Documentation

**Fetch the latest MCP protocol documentation:**

Use WebFetch to load: `https://modelcontextprotocol.io/llms-full.txt`

This comprehensive document contains the complete MCP specification and guidelines.

#### 1.4 Study Framework Documentation

**Load and read the following reference files:**

- **MCP Best Practices**: [📋 View Best Practices](./reference/mcp_best_practices.md) - Core guidelines for all MCP servers

**For Python implementations, also load:**
- **Python SDK Documentation**: Use WebFetch to load `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- [🐍 Python Implementation Guide](./reference/python_mcp_server.md) - Python-specific best practices and examples

**For Node/TypeScript implementations, also load:**
- **TypeScript SDK Documentation**: Use WebFetch to load `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- [⚡ TypeScript Implementation Guide](./reference/node_mcp_server.md) - Node/TypeScript-specific best practices and examples

#### 1.5 Exhaustively Study API Documentation

To integrate a service, read through **ALL** available API documentation:
- Official API reference documentation
- Authentication and authorization requirements
- Rate limiting and pagination patterns
- Error responses and status codes
- Available endpoints and their parameters
- Data models and schemas

**To gather comprehensive information, use web search and the WebFetch tool as needed.**

#### 1.6 Create a Comprehensive Implementation Plan

Based on your research, create a detailed plan that includes:

**Tool Selection:**
- List the most valuable endpoints/operations to implement
- Prioritize tools that enable the most common and important use cases
- Consider which tools work together to enable complex workflows

**Shared Utilities and Helpers:**
- Identify common API request patterns
- Plan pagination helpers
- Design filtering and formatting utilities
- Plan error handling strategies

**Input/Output Design:**
- Define input validation models (Pydantic for Python, Zod for TypeScript)
- Design consistent response formats (e.g., JSON or Markdown), and configurable levels of detail (e.g., Detailed or Concise)
- Plan for large-scale usage (thousands of users/resources)
- Implement character limits and truncation strategies (e.g., 25,000 tokens)

**Error Handling Strategy:**
- Plan graceful failure modes
- Design clear, actionable, LLM-friendly, natural language error messages which prompt further action
- Consider rate limiting and timeout scenarios
- Handle authentication and authorization errors

---

### Phase 2: Implementation

Now that you have a comprehensive plan, begin implementation following language-specific best practices.

#### 2.1 Set Up Project Structure

**For Python:**
- Create a single `.py` file or organize into modules if complex (see [🐍 Python Guide](./reference/python_mcp_server.md))
- Use the MCP Python SDK for tool registration
- Define Pydantic models for input validation

**For Node/TypeScript:**
- Create proper project structure (see [⚡ TypeScript Guide](./reference/node_mcp_server.md))
- Set up `package.json` and `tsconfig.json`
- Use MCP TypeScript SDK
- Define Zod schemas for input validation

#### 2.2 Implement Core Infrastructure First

**To begin implementation, create shared utilities before implementing tools:**
- API request helper functions
- Error handling utilities
- Response formatting functions (JSON and Markdown)
- Pagination helpers
- Authentication/token management

#### 2.3 Implement Tools Systematically

For each tool in the plan:

**Define Input Schema:**
- Use Pydantic (Python) or Zod (TypeScript) for validation
- Include proper constraints (min/max length, regex patterns, min/max values, ranges)
- Provide clear, descriptive field descriptions
- Include diverse examples in field descriptions

**Write Comprehensive Docstrings/Descriptions:**
- One-line summary of what the tool does
- Detailed explanation of purpose and functionality
- Explicit parameter types with examples
- Complete return type schema
- Usage examples (when to use, when not to use)
- Error handling documentation, which outlines how to proceed given specific errors

**Implement Tool Logic:**
- Use shared utilities to avoid code duplication
- Follow async/await patterns for all I/O
- Implement proper error handling
- Support multiple response formats (JSON and Markdown)
- Respect pagination parameters
- Check character limits and truncate appropriately

**Add Tool Annotations:**
- `readOnlyHint`: true (for read-only operations)
- `destructiveHint`: false (for non-destructive operations)
- `idempotentHint`: true (if repeated calls have same effect)
- `openWorldHint`: true (if interacting with external systems)

#### 2.4 Follow Language-Specific Best Practices

**At this point, load the appropriate language guide:**

**For Python: Load [🐍 Python Implementation Guide](./reference/python_mcp_server.md) and ensure the following:**
- Using MCP Python SDK with proper tool registration
- Pydantic v2 models with `model_config`
- Type hints throughout
- Async/await for all I/O operations
- Proper imports organization
- Module-level constants (CHARACTER_LIMIT, API_BASE_URL)

**For Node/TypeScript: Load [⚡ TypeScript Implementation Guide](./reference/node_mcp_server.md) and ensure the following:**
- Using `server.registerTool` properly
- Zod schemas with `.strict()`
- TypeScript strict mode enabled
- No `any` types - use proper types
- Explicit Promise<T> return types
- Build process configured (`npm run build`)

---

### Phase 3: Review and Refine

After initial implementation:

#### 3.1 Code Quality Review

To ensure quality, review the code for:
- **DRY Principle**: No duplicated code between tools
- **Composability**: Shared logic extracted into functions
- **Consistency**: Similar operations return similar formats
- **Error Handling**: All external calls have error handling
- **Type Safety**: Full type coverage (Python type hints, TypeScript types)
- **Documentation**: Every tool has comprehensive docstrings/descriptions

#### 3.2 Test and Build

**Important:** MCP servers are long-running processes that wait for requests over stdio/stdin or sse/http. Running them directly in your main process (e.g., `python server.py` or `node dist/index.js`) will cause your process to hang indefinitely.

**Safe ways to test the server:**
- Use the evaluation harness (see Phase 4) - recommended approach
- Run the server in tmux to keep it outside your main process
- Use a timeout when testing: `timeout 5s python server.py`

**For Python:**
- Verify Python syntax: `python -m py_compile your_server.py`
- Check imports work correctly by reviewing the file
- To manually test: Run server in tmux, then test with evaluation harness in main process
- Or use the evaluation harness directly (it manages the server for stdio transport)

**For Node/TypeScript:**
- Run `npm run build` and ensure it completes without errors
- Verify dist/index.js is created
- To manually test: Run server in tmux, then test with evaluation harness in main process
- Or use the evaluation harness directly (it manages the server for stdio transport)

#### 3.3 Use Quality Checklist

To verify implementation quality, load the appropriate checklist from the language-specific guide:
- Python: see "Quality Checklist" in [🐍 Python Guide](./reference/python_mcp_server.md)
- Node/TypeScript: see "Quality Checklist" in [⚡ TypeScript Guide](./reference/node_mcp_server.md)

---

### Phase 4: Create Evaluations

After implementing your MCP server, create comprehensive evaluations to test its effectiveness.

**Load [✅ Evaluation Guide](./reference/evaluation.md) for complete evaluation guidelines.**

#### 4.1 Understand Evaluation Purpose

Evaluations test whether LLMs can effectively use your MCP server to answer realistic, complex questions.

#### 4.2 Create 10 Evaluation Questions

To create effective evaluations, follow the process outlined in the evaluation guide:

1. **Tool Inspection**: List available tools and understand their capabilities
2. **Content Exploration**: Use READ-ONLY operations to explore available data
3. **Question Generation**: Create 10 complex, realistic questions
4. **Answer Verification**: Solve each question yourself to verify answers

#### 4.3 Evaluation Requirements

Each question must be:
- **Independent**: Not dependent on other questions
- **Read-only**: Only non-destructive operations required
- **Complex**: Requiring multiple tool calls and deep exploration
- **Realistic**: Based on real use cases humans would care about
- **Verifiable**: Single, clear answer that can be verified by string comparison
- **Stable**: Answer won't change over time

#### 4.4 Output Format

Create an XML file with this structure:

```xml
<evaluation>
  <qa_pair>
    <question>Find discussions about AI model launches with animal codenames. One model needed a specific safety designation that uses the format ASL-X. What number X was being determined for the model named after a spotted wild cat?</question>
    <answer>3</answer>
  </qa_pair>
<!-- More qa_pairs... -->
</evaluation>
```

---

# Reference Files

## 📚 Documentation Library

Load these resources as needed during development:

### Core MCP Documentation (Load First)
- **MCP Protocol**: Fetch from `https://modelcontextprotocol.io/llms-full.txt` - Complete MCP specification
- [📋 MCP Best Practices](./reference/mcp_best_practices.md) - Universal MCP guidelines including:
  - Server and tool naming conventions
  - Response format guidelines (JSON vs Markdown)
  - Pagination best practices
  - Character limits and truncation strategies
  - Tool development guidelines
  - Security and error handling standards

### SDK Documentation (Load During Phase 1/2)
- **Python SDK**: Fetch from `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- **TypeScript SDK**: Fetch from `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`

### Language-Specific Implementation Guides (Load During Phase 2)
- [🐍 Python Implementation Guide](./reference/python_mcp_server.md) - Complete Python/FastMCP guide with:
  - Server initialization patterns
  - Pydantic model examples
  - Tool registration with `@mcp.tool`
  - Complete working examples
  - Quality checklist

- [⚡ TypeScript Implementation Guide](./reference/node_mcp_server.md) - Complete TypeScript guide with:
  - Project structure
  - Zod schema patterns
  - Tool registration with `server.registerTool`
  - Complete working examples
  - Quality checklist

### Evaluation Guide (Load During Phase 4)
- [✅ Evaluation Guide](./reference/evaluation.md) - Complete evaluation creation guide with:
  - Question creation guidelines
  - Answer verification strategies
  - XML format specifications
  - Example questions and answers
  - Running an evaluation with the provided scripts

---
### Skill: mcp-management


# MCP Management

Skill for managing and interacting with Model Context Protocol (MCP) servers.

## Overview

MCP is an open protocol enabling AI agents to connect to external tools and data sources. This skill provides scripts and utilities to discover, analyze, and execute MCP capabilities from configured servers without polluting the main context window.

**Key Benefits**:
- Progressive disclosure of MCP capabilities (load only what's needed)
- Intelligent tool/prompt/resource selection based on task requirements
- Multi-server management from single config file
- Context-efficient: subagents handle MCP discovery and execution
- Persistent tool catalog: automatically saves discovered tools to JSON for fast reference

## When to Use This Skill

Use this skill when:
1. **Discovering MCP Capabilities**: Need to list available tools/prompts/resources from configured servers
2. **Task-Based Tool Selection**: Analyzing which MCP tools are relevant for a specific task
3. **Executing MCP Tools**: Calling MCP tools programmatically with proper parameter handling
4. **MCP Integration**: Building or debugging MCP client implementations
5. **Context Management**: Avoiding context pollution by delegating MCP operations to subagents

## Core Capabilities

### 1. Configuration Management

MCP servers configured in `.opencode/.mcp.json`.

**Gemini CLI Integration** (recommended): Create symlink to `.gemini/settings.json`:
```bash
mkdir -p .gemini && ln -sf .opencode/.mcp.json .gemini/settings.json
```

See [references/configuration.md](references/configuration.md) and [references/gemini-cli-integration.md](references/gemini-cli-integration.md).

**GEMINI.md Response Format**: Project root contains `GEMINI.md` that Gemini CLI auto-loads, enforcing structured JSON responses:
```json
{"server":"name","tool":"name","success":true,"result":<data>,"error":null}
```

This ensures parseable, consistent output instead of unpredictable natural language. The file defines:
- Mandatory JSON-only response format (no markdown, no explanations)
- Maximum 500 character responses
- Error handling structure
- Available MCP servers reference

**Benefits**: Programmatically parseable output, consistent error reporting, DRY configuration (format defined once), context-efficient (auto-loaded by Gemini CLI).

### 2. Capability Discovery

```bash
npx tsx scripts/cli.ts list-tools  # Saves to assets/tools.json
npx tsx scripts/cli.ts list-prompts
npx tsx scripts/cli.ts list-resources
```

Aggregates capabilities from multiple servers with server identification.

### 3. Intelligent Tool Analysis

LLM analyzes `assets/tools.json` directly - better than keyword matching algorithms.

### 4. Tool Execution

**Primary: Gemini CLI** (if available)
```bash
# IMPORTANT: Use stdin piping, NOT -p flag (deprecated, skips MCP init)
echo "Take a screenshot of https://example.com" | gemini -y -m gemini-2.5-flash
```

**Secondary: Direct Scripts**
```bash
npx tsx scripts/cli.ts call-tool memory create_entities '{"entities":[...]}'
```

**Fallback: mcp-manager Subagent**

See [references/gemini-cli-integration.md](references/gemini-cli-integration.md) for complete examples.

## Implementation Patterns

### Pattern 1: Gemini CLI Auto-Execution (Primary)

Use Gemini CLI for automatic tool discovery and execution. Gemini CLI auto-loads `GEMINI.md` from project root to enforce structured JSON responses.

**Quick Example**:
```bash
# IMPORTANT: Use stdin piping, NOT -p flag (deprecated, skips MCP init)
# Add "Return JSON only per GEMINI.md instructions" to enforce structured output
echo "Take a screenshot of https://example.com. Return JSON only per GEMINI.md instructions." | gemini -y -m gemini-2.5-flash
```

**Expected Output**:
```json
{"server":"puppeteer","tool":"screenshot","success":true,"result":"screenshot.png","error":null}
```

**Benefits**:
- Automatic tool discovery
- Structured JSON responses (parseable by Claude)
- GEMINI.md auto-loaded for consistent formatting
- Faster than subagent orchestration
- No natural language ambiguity

See [references/gemini-cli-integration.md](references/gemini-cli-integration.md) for complete guide.

### Pattern 2: Subagent-Based Execution (Fallback)

Use `mcp-manager` agent when Gemini CLI unavailable. Subagent discovers tools, selects relevant ones, executes tasks, reports back.

**Benefit**: Main context stays clean, only relevant tool definitions loaded when needed.

### Pattern 3: LLM-Driven Tool Selection

LLM reads `assets/tools.json`, intelligently selects relevant tools using context understanding, synonyms, and intent recognition.

### Pattern 4: Multi-Server Orchestration

Coordinate tools across multiple servers. Each tool knows its source server for proper routing.

## Scripts Reference

### scripts/mcp-client.ts

Core MCP client manager class. Handles:
- Config loading from `.opencode/.mcp.json`
- Connecting to multiple MCP servers
- Listing tools/prompts/resources across all servers
- Executing tools with proper error handling
- Connection lifecycle management

### scripts/cli.ts

Command-line interface for MCP operations. Commands:
- `list-tools` - Display all tools and save to `assets/tools.json`
- `list-prompts` - Display all prompts
- `list-resources` - Display all resources
- `call-tool <server> <tool> <json>` - Execute a tool

**Note**: `list-tools` persists complete tool catalog to `assets/tools.json` with full schemas for fast reference, offline browsing, and version control.

## Quick Start

**Method 1: Gemini CLI** (recommended)
```bash
npm install -g gemini-cli
mkdir -p .gemini && ln -sf .opencode/.mcp.json .gemini/settings.json
# IMPORTANT: Use stdin piping, NOT -p flag (deprecated, skips MCP init)
# GEMINI.md auto-loads to enforce JSON responses
echo "Take a screenshot of https://example.com. Return JSON only per GEMINI.md instructions." | gemini -y -m gemini-2.5-flash
```

Returns structured JSON: `{"server":"puppeteer","tool":"screenshot","success":true,"result":"screenshot.png","error":null}`

**Method 2: Scripts**
```bash
cd .opencode/skills/mcp-management/scripts && npm install
npx tsx cli.ts list-tools  # Saves to assets/tools.json
npx tsx cli.ts call-tool memory create_entities '{"entities":[...]}'
```

**Method 3: mcp-manager Subagent**

See [references/gemini-cli-integration.md](references/gemini-cli-integration.md) for complete guide.

## Technical Details

See [references/mcp-protocol.md](references/mcp-protocol.md) for:
- JSON-RPC protocol details
- Message types and formats
- Error codes and handling
- Transport mechanisms (stdio, HTTP+SSE)
- Best practices

## Integration Strategy

### Execution Priority

1. **Gemini CLI** (Primary): Fast, automatic, intelligent tool selection
   - Check: `command -v gemini`
   - Execute: `echo "<task>" | gemini -y -m gemini-2.5-flash`
   - **IMPORTANT**: Use stdin piping, NOT `-p` flag (deprecated, skips MCP init)
   - Best for: All tasks when available

2. **Direct CLI Scripts** (Secondary): Manual tool specification
   - Use when: Need specific tool/server control
   - Execute: `npx tsx scripts/cli.ts call-tool <server> <tool> <args>`

3. **mcp-manager Subagent** (Fallback): Context-efficient delegation
   - Use when: Gemini unavailable or failed
   - Keeps main context clean

### Integration with Agents

The `mcp-manager` agent uses this skill to:
- Check Gemini CLI availability first
- Execute via `gemini` command if available
- Fallback to direct script execution
- Discover MCP capabilities without loading into main context
- Report results back to main agent

This keeps main agent context clean and enables efficient MCP integration.
---
### Skill: databases


# Databases Skill

Unified guide for working with MongoDB (document-oriented) and PostgreSQL (relational) databases. Choose the right database for your use case and master both systems.

## When to Use This Skill

Use when:
- Designing database schemas and data models
- Writing queries (SQL or MongoDB query language)
- Building aggregation pipelines or complex joins
- Optimizing indexes and query performance
- Implementing database migrations
- Setting up replication, sharding, or clustering
- Configuring backups and disaster recovery
- Managing database users and permissions
- Analyzing slow queries and performance issues
- Administering production database deployments

## Database Selection Guide

### Choose MongoDB When:
- Schema flexibility: frequent structure changes, heterogeneous data
- Document-centric: natural JSON/BSON data model
- Horizontal scaling: need to shard across multiple servers
- High write throughput: IoT, logging, real-time analytics
- Nested/hierarchical data: embedded documents preferred
- Rapid prototyping: schema evolution without migrations

**Best for:** Content management, catalogs, IoT time series, real-time analytics, mobile apps, user profiles

### Choose PostgreSQL When:
- Strong consistency: ACID transactions critical
- Complex relationships: many-to-many joins, referential integrity
- SQL requirement: team expertise, reporting tools, BI systems
- Data integrity: strict schema validation, constraints
- Mature ecosystem: extensive tooling, extensions
- Complex queries: window functions, CTEs, analytical workloads

**Best for:** Financial systems, e-commerce transactions, ERP, CRM, data warehousing, analytics

### Both Support:
- JSON/JSONB storage and querying
- Full-text search capabilities
- Geospatial queries and indexing
- Replication and high availability
- ACID transactions (MongoDB 4.0+)
- Strong security features

## Quick Start

### MongoDB Setup

```bash
# Atlas (Cloud) - Recommended
# 1. Sign up at mongodb.com/atlas
# 2. Create M0 free cluster
# 3. Get connection string

# Connection
mongodb+srv://user:pass@cluster.mongodb.net/db

# Shell
mongosh "mongodb+srv://cluster.mongodb.net/mydb"

# Basic operations
db.users.insertOne({ name: "Alice", age: 30 })
db.users.find({ age: { $gte: 18 } })
db.users.updateOne({ name: "Alice" }, { $set: { age: 31 } })
db.users.deleteOne({ name: "Alice" })
```

### PostgreSQL Setup

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Connect
psql -U postgres -d mydb

# Basic operations
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, age INT);
INSERT INTO users (name, age) VALUES ('Alice', 30);
SELECT * FROM users WHERE age >= 18;
UPDATE users SET age = 31 WHERE name = 'Alice';
DELETE FROM users WHERE name = 'Alice';
```

## Common Operations

### Create/Insert
```javascript
// MongoDB
db.users.insertOne({ name: "Bob", email: "bob@example.com" })
db.users.insertMany([{ name: "Alice" }, { name: "Charlie" }])
```

```sql
-- PostgreSQL
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
INSERT INTO users (name, email) VALUES ('Alice', NULL), ('Charlie', NULL);
```

### Read/Query
```javascript
// MongoDB
db.users.find({ age: { $gte: 18 } })
db.users.findOne({ email: "bob@example.com" })
```

```sql
-- PostgreSQL
SELECT * FROM users WHERE age >= 18;
SELECT * FROM users WHERE email = 'bob@example.com' LIMIT 1;
```

### Update
```javascript
// MongoDB
db.users.updateOne({ name: "Bob" }, { $set: { age: 25 } })
db.users.updateMany({ status: "pending" }, { $set: { status: "active" } })
```

```sql
-- PostgreSQL
UPDATE users SET age = 25 WHERE name = 'Bob';
UPDATE users SET status = 'active' WHERE status = 'pending';
```

### Delete
```javascript
// MongoDB
db.users.deleteOne({ name: "Bob" })
db.users.deleteMany({ status: "deleted" })
```

```sql
-- PostgreSQL
DELETE FROM users WHERE name = 'Bob';
DELETE FROM users WHERE status = 'deleted';
```

### Indexing
```javascript
// MongoDB
db.users.createIndex({ email: 1 })
db.users.createIndex({ status: 1, createdAt: -1 })
```

```sql
-- PostgreSQL
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status_created ON users(status, created_at DESC);
```

## Reference Navigation

### MongoDB References
- **[mongodb-crud.md](references/mongodb-crud.md)** - CRUD operations, query operators, atomic updates
- **[mongodb-aggregation.md](references/mongodb-aggregation.md)** - Aggregation pipeline, stages, operators, patterns
- **[mongodb-indexing.md](references/mongodb-indexing.md)** - Index types, compound indexes, performance optimization
- **[mongodb-atlas.md](references/mongodb-atlas.md)** - Atlas cloud setup, clusters, monitoring, search

### PostgreSQL References
- **[postgresql-queries.md](references/postgresql-queries.md)** - SELECT, JOINs, subqueries, CTEs, window functions
- **[postgresql-psql-cli.md](references/postgresql-psql-cli.md)** - psql commands, meta-commands, scripting
- **[postgresql-performance.md](references/postgresql-performance.md)** - EXPLAIN, query optimization, vacuum, indexes
- **[postgresql-administration.md](references/postgresql-administration.md)** - User management, backups, replication, maintenance

## Python Utilities

Database utility scripts in `scripts/`:
- **db_migrate.py** - Generate and apply migrations for both databases
- **db_backup.py** - Backup and restore MongoDB and PostgreSQL
- **db_performance_check.py** - Analyze slow queries and recommend indexes

```bash
# Generate migration
python scripts/db_migrate.py --db mongodb --generate "add_user_index"

# Run backup
python scripts/db_backup.py --db postgres --output /backups/

# Check performance
python scripts/db_performance_check.py --db mongodb --threshold 100ms
```

## Key Differences Summary

| Feature | MongoDB | PostgreSQL |
|---------|---------|------------|
| Data Model | Document (JSON/BSON) | Relational (Tables/Rows) |
| Schema | Flexible, dynamic | Strict, predefined |
| Query Language | MongoDB Query Language | SQL |
| Joins | $lookup (limited) | Native, optimized |
| Transactions | Multi-document (4.0+) | Native ACID |
| Scaling | Horizontal (sharding) | Vertical (primary), Horizontal (extensions) |
| Indexes | Single, compound, text, geo, etc | B-tree, hash, GiST, GIN, etc |

## Best Practices

**MongoDB:**
- Use embedded documents for 1-to-few relationships
- Reference documents for 1-to-many or many-to-many
- Index frequently queried fields
- Use aggregation pipeline for complex transformations
- Enable authentication and TLS in production
- Use Atlas for managed hosting

**PostgreSQL:**
- Normalize schema to 3NF, denormalize for performance
- Use foreign keys for referential integrity
- Index foreign keys and frequently filtered columns
- Use EXPLAIN ANALYZE to optimize queries
- Regular VACUUM and ANALYZE maintenance
- Connection pooling (pgBouncer) for web apps

## Resources

- MongoDB: https://www.mongodb.com/docs/
- PostgreSQL: https://www.postgresql.org/docs/
- MongoDB University: https://learn.mongodb.com/
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/

---
### Skill: backend-development


# Backend Development Skill

Production-ready backend development with modern technologies, best practices, and proven patterns.

## When to Use

- Designing RESTful, GraphQL, or gRPC APIs
- Building authentication/authorization systems
- Optimizing database queries and schemas
- Implementing caching and performance optimization
- OWASP Top 10 security mitigation
- Designing scalable microservices
- Testing strategies (unit, integration, E2E)
- CI/CD pipelines and deployment
- Monitoring and debugging production systems

## Technology Selection Guide

**Languages:** Node.js/TypeScript (full-stack), Python (data/ML), Go (concurrency), Rust (performance)
**Frameworks:** NestJS, FastAPI, Django, Express, Gin
**Databases:** PostgreSQL (ACID), MongoDB (flexible schema), Redis (caching)
**APIs:** REST (simple), GraphQL (flexible), gRPC (performance)

See: `references/backend-technologies.md` for detailed comparisons

## Reference Navigation

**Core Technologies:**
- `backend-technologies.md` - Languages, frameworks, databases, message queues, ORMs
- `backend-api-design.md` - REST, GraphQL, gRPC patterns and best practices

**Security & Authentication:**
- `backend-security.md` - OWASP Top 10 2025, security best practices, input validation
- `backend-authentication.md` - OAuth 2.1, JWT, RBAC, MFA, session management

**Performance & Architecture:**
- `backend-performance.md` - Caching, query optimization, load balancing, scaling
- `backend-architecture.md` - Microservices, event-driven, CQRS, saga patterns

**Quality & Operations:**
- `backend-testing.md` - Testing strategies, frameworks, tools, CI/CD testing
- `backend-code-quality.md` - SOLID principles, design patterns, clean code
- `backend-devops.md` - Docker, Kubernetes, deployment strategies, monitoring
- `backend-debugging.md` - Debugging strategies, profiling, logging, production debugging
- `backend-mindset.md` - Problem-solving, architectural thinking, collaboration

## Key Best Practices (2025)

**Security:** Argon2id passwords, parameterized queries (98% SQL injection reduction), OAuth 2.1 + PKCE, rate limiting, security headers

**Performance:** Redis caching (90% DB load reduction), database indexing (30% I/O reduction), CDN (50%+ latency cut), connection pooling

**Testing:** 70-20-10 pyramid (unit-integration-E2E), Vitest 50% faster than Jest, contract testing for microservices, 83% migrations fail without tests

**DevOps:** Blue-green/canary deployments, feature flags (90% fewer failures), Kubernetes 84% adoption, Prometheus/Grafana monitoring, OpenTelemetry tracing

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| Fast development | Node.js + NestJS |
| Data/ML integration | Python + FastAPI |
| High concurrency | Go + Gin |
| Max performance | Rust + Axum |
| ACID transactions | PostgreSQL |
| Flexible schema | MongoDB |
| Caching | Redis |
| Internal services | gRPC |
| Public APIs | GraphQL/REST |
| Real-time events | Kafka |

## Implementation Checklist

**API:** Choose style → Design schema → Validate input → Add auth → Rate limiting → Documentation → Error handling

**Database:** Choose DB → Design schema → Create indexes → Connection pooling → Migration strategy → Backup/restore → Test performance

**Security:** OWASP Top 10 → Parameterized queries → OAuth 2.1 + JWT → Security headers → Rate limiting → Input validation → Argon2id passwords

**Testing:** Unit 70% → Integration 20% → E2E 10% → Load tests → Migration tests → Contract tests (microservices)

**Deployment:** Docker → CI/CD → Blue-green/canary → Feature flags → Monitoring → Logging → Health checks

## Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OAuth 2.1: https://oauth.net/2.1/
- OpenTelemetry: https://opentelemetry.io/

---
### Skill: frontend-design


Create distinctive, production-grade frontend interfaces. Implement real working code with exceptional aesthetic attention.

## Workflow Selection

Choose workflow based on input type:

| Input | Workflow | Reference |
|-------|----------|-----------|
| Screenshot | Replicate exactly | `./references/workflow-screenshot.md` |
| Video | Replicate with animations | `./references/workflow-video.md` |
| Screenshot/Video (describe only) | Document for devs | `./references/workflow-describe.md` |
| 3D/WebGL request | Three.js immersive | `./references/workflow-3d.md` |
| Quick task | Rapid implementation | `./references/workflow-quick.md` |
| Complex/award-quality | Full immersive | `./references/workflow-immersive.md` |
| From scratch | Design Thinking below | - |

**All workflows**: Activate `ui-ux-pro-max` skill FIRST for design intelligence.

## Screenshot/Video Replication (Quick Reference)

1. **Analyze** with `ai-multimodal` skill - extract colors, fonts, spacing, effects
2. **Plan** with `ui-ux-designer` subagent - create phased implementation
3. **Implement** - match source precisely
4. **Verify** - compare to original
5. **Document** - update `./docs/design-guidelines.md` if approved

See specific workflow files for detailed steps.

## Design Thinking (From Scratch)

Before coding, commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Execute with precision. Bold maximalism and refined minimalism both work - intentionality is key.

## Aesthetics Guidelines

- **Typography**: Avoid Arial/Inter; use distinctive, characterful fonts. Pair display + body fonts.
- **Color**: Commit to cohesive palette. CSS variables. Dominant colors with sharp accents.
- **Motion**: CSS-first, anime.js for complex (`./references/animejs.md`). Orchestrated page loads > scattered micro-interactions.
- **Spatial**: Unexpected layouts. Asymmetry. Overlap. Negative space OR controlled density.
- **Backgrounds**: Atmosphere over solid colors. Gradients, noise, patterns, shadows, grain.
- **Assets**: Generate with `ai-multimodal`, process with `media-processing`

## Asset & Analysis References

| Task | Reference |
|------|-----------|
| Generate assets | `./references/asset-generation.md` |
| Analyze quality | `./references/visual-analysis-overview.md` |
| Extract guidelines | `./references/design-extraction-overview.md` |
| Optimization | `./references/technical-overview.md` |
| Animations | `./references/animejs.md` |

Quick start: `./references/ai-multimodal-overview.md`

## Anti-Patterns (AI Slop)

NEVER use:
- Overused fonts: Inter, Roboto, Arial, Space Grotesk
- Cliched colors: purple gradients on white
- Predictable layouts, cookie-cutter patterns

DO:
- Vary themes (light/dark), fonts, aesthetics per project
- Match complexity to vision (maximalist = elaborate; minimalist = precise)
- Make unexpected, context-specific choices

Remember: Claude is capable of extraordinary creative work. Commit fully to distinctive visions.
---
### Skill: frontend-development


# Frontend Development Guidelines

## Purpose

Comprehensive guide for modern React development, emphasizing Suspense-based data fetching, lazy loading, proper file organization, and performance optimization.

## When to Use This Skill

- Creating new components or pages
- Building new features
- Fetching data with TanStack Query
- Setting up routing with TanStack Router
- Styling components with MUI v7
- Performance optimization
- Organizing frontend code
- TypeScript best practices

---

## Quick Start

### New Component Checklist

Creating a component? Follow this checklist:

- [ ] Use `React.FC<Props>` pattern with TypeScript
- [ ] Lazy load if heavy component: `React.lazy(() => import())`
- [ ] Wrap in `<SuspenseLoader>` for loading states
- [ ] Use `useSuspenseQuery` for data fetching
- [ ] Import aliases: `@/`, `~types`, `~components`, `~features`
- [ ] Styles: Inline if <100 lines, separate file if >100 lines
- [ ] Use `useCallback` for event handlers passed to children
- [ ] Default export at bottom
- [ ] No early returns with loading spinners
- [ ] Use `useMuiSnackbar` for user notifications

### New Feature Checklist

Creating a feature? Set up this structure:

- [ ] Create `features/{feature-name}/` directory
- [ ] Create subdirectories: `api/`, `components/`, `hooks/`, `helpers/`, `types/`
- [ ] Create API service file: `api/{feature}Api.ts`
- [ ] Set up TypeScript types in `types/`
- [ ] Create route in `routes/{feature-name}/index.tsx`
- [ ] Lazy load feature components
- [ ] Use Suspense boundaries
- [ ] Export public API from feature `index.ts`

---

## Import Aliases Quick Reference

| Alias | Resolves To | Example |
|-------|-------------|---------|
| `@/` | `src/` | `import { apiClient } from '@/lib/apiClient'` |
| `~types` | `src/types` | `import type { User } from '~types/user'` |
| `~components` | `src/components` | `import { SuspenseLoader } from '~components/SuspenseLoader'` |
| `~features` | `src/features` | `import { authApi } from '~features/auth'` |

Defined in: [vite.config.ts](../../vite.config.ts) lines 180-185

---

## Common Imports Cheatsheet

```typescript
// React & Lazy Loading
import React, { useState, useCallback, useMemo } from 'react';
const Heavy = React.lazy(() => import('./Heavy'));

// MUI Components
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

// TanStack Query (Suspense)
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';

// TanStack Router
import { createFileRoute } from '@tanstack/react-router';

// Project Components
import { SuspenseLoader } from '~components/SuspenseLoader';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useMuiSnackbar } from '@/hooks/useMuiSnackbar';

// Types
import type { Post } from '~types/post';
```

---

## Topic Guides

### 🎨 Component Patterns

**Modern React components use:**
- `React.FC<Props>` for type safety
- `React.lazy()` for code splitting
- `SuspenseLoader` for loading states
- Named const + default export pattern

**Key Concepts:**
- Lazy load heavy components (DataGrid, charts, editors)
- Always wrap lazy components in Suspense
- Use SuspenseLoader component (with fade animation)
- Component structure: Props → Hooks → Handlers → Render → Export

**[📖 Complete Guide: resources/component-patterns.md](resources/component-patterns.md)**

---

### 📊 Data Fetching

**PRIMARY PATTERN: useSuspenseQuery**
- Use with Suspense boundaries
- Cache-first strategy (check grid cache before API)
- Replaces `isLoading` checks
- Type-safe with generics

**API Service Layer:**
- Create `features/{feature}/api/{feature}Api.ts`
- Use `apiClient` axios instance
- Centralized methods per feature
- Route format: `/form/route` (NOT `/api/form/route`)

**[📖 Complete Guide: resources/data-fetching.md](resources/data-fetching.md)**

---

### 📁 File Organization

**features/ vs components/:**
- `features/`: Domain-specific (posts, comments, auth)
- `components/`: Truly reusable (SuspenseLoader, CustomAppBar)

**Feature Subdirectories:**
```
features/
  my-feature/
    api/          # API service layer
    components/   # Feature components
    hooks/        # Custom hooks
    helpers/      # Utility functions
    types/        # TypeScript types
```

**[📖 Complete Guide: resources/file-organization.md](resources/file-organization.md)**

---

### 🎨 Styling

**Inline vs Separate:**
- <100 lines: Inline `const styles: Record<string, SxProps<Theme>>`
- >100 lines: Separate `.styles.ts` file

**Primary Method:**
- Use `sx` prop for MUI components
- Type-safe with `SxProps<Theme>`
- Theme access: `(theme) => theme.palette.primary.main`

**MUI v7 Grid:**
```typescript
<Grid size={{ xs: 12, md: 6 }}>  // ✅ v7 syntax
<Grid xs={12} md={6}>             // ❌ Old syntax
```

**[📖 Complete Guide: resources/styling-guide.md](resources/styling-guide.md)**

---

### 🛣️ Routing

**TanStack Router - Folder-Based:**
- Directory: `routes/my-route/index.tsx`
- Lazy load components
- Use `createFileRoute`
- Breadcrumb data in loader

**Example:**
```typescript
import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

const MyPage = lazy(() => import('@/features/my-feature/components/MyPage'));

export const Route = createFileRoute('/my-route/')({
    component: MyPage,
    loader: () => ({ crumb: 'My Route' }),
});
```

**[📖 Complete Guide: resources/routing-guide.md](resources/routing-guide.md)**

---

### ⏳ Loading & Error States

**CRITICAL RULE: No Early Returns**

```typescript
// ❌ NEVER - Causes layout shift
if (isLoading) {
    return <LoadingSpinner />;
}

// ✅ ALWAYS - Consistent layout
<SuspenseLoader>
    <Content />
</SuspenseLoader>
```

**Why:** Prevents Cumulative Layout Shift (CLS), better UX

**Error Handling:**
- Use `useMuiSnackbar` for user feedback
- NEVER `react-toastify`
- TanStack Query `onError` callbacks

**[📖 Complete Guide: resources/loading-and-error-states.md](resources/loading-and-error-states.md)**

---

### ⚡ Performance

**Optimization Patterns:**
- `useMemo`: Expensive computations (filter, sort, map)
- `useCallback`: Event handlers passed to children
- `React.memo`: Expensive components
- Debounced search (300-500ms)
- Memory leak prevention (cleanup in useEffect)

**[📖 Complete Guide: resources/performance.md](resources/performance.md)**

---

### 📘 TypeScript

**Standards:**
- Strict mode, no `any` type
- Explicit return types on functions
- Type imports: `import type { User } from '~types/user'`
- Component prop interfaces with JSDoc

**[📖 Complete Guide: resources/typescript-standards.md](resources/typescript-standards.md)**

---

### 🔧 Common Patterns

**Covered Topics:**
- React Hook Form with Zod validation
- DataGrid wrapper contracts
- Dialog component standards
- `useAuth` hook for current user
- Mutation patterns with cache invalidation

**[📖 Complete Guide: resources/common-patterns.md](resources/common-patterns.md)**

---

### 📚 Complete Examples

**Full working examples:**
- Modern component with all patterns
- Complete feature structure
- API service layer
- Route with lazy loading
- Suspense + useSuspenseQuery
- Form with validation

**[📖 Complete Guide: resources/complete-examples.md](resources/complete-examples.md)**

---

## Navigation Guide

| Need to... | Read this resource |
|------------|-------------------|
| Create a component | [component-patterns.md](resources/component-patterns.md) |
| Fetch data | [data-fetching.md](resources/data-fetching.md) |
| Organize files/folders | [file-organization.md](resources/file-organization.md) |
| Style components | [styling-guide.md](resources/styling-guide.md) |
| Set up routing | [routing-guide.md](resources/routing-guide.md) |
| Handle loading/errors | [loading-and-error-states.md](resources/loading-and-error-states.md) |
| Optimize performance | [performance.md](resources/performance.md) |
| TypeScript types | [typescript-standards.md](resources/typescript-standards.md) |
| Forms/Auth/DataGrid | [common-patterns.md](resources/common-patterns.md) |
| See full examples | [complete-examples.md](resources/complete-examples.md) |

---

## Core Principles

1. **Lazy Load Everything Heavy**: Routes, DataGrid, charts, editors
2. **Suspense for Loading**: Use SuspenseLoader, not early returns
3. **useSuspenseQuery**: Primary data fetching pattern for new code
4. **Features are Organized**: api/, components/, hooks/, helpers/ subdirs
5. **Styles Based on Size**: <100 inline, >100 separate
6. **Import Aliases**: Use @/, ~types, ~components, ~features
7. **No Early Returns**: Prevents layout shift
8. **useMuiSnackbar**: For all user notifications

---

## Quick Reference: File Structure

```
src/
  features/
    my-feature/
      api/
        myFeatureApi.ts       # API service
      components/
        MyFeature.tsx         # Main component
        SubComponent.tsx      # Related components
      hooks/
        useMyFeature.ts       # Custom hooks
        useSuspenseMyFeature.ts  # Suspense hooks
      helpers/
        myFeatureHelpers.ts   # Utilities
      types/
        index.ts              # TypeScript types
      index.ts                # Public exports

  components/
    SuspenseLoader/
      SuspenseLoader.tsx      # Reusable loader
    CustomAppBar/
      CustomAppBar.tsx        # Reusable app bar

  routes/
    my-route/
      index.tsx               # Route component
      create/
        index.tsx             # Nested route
```

---

## Modern Component Template (Quick Copy)

```typescript
import React, { useState, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { featureApi } from '../api/featureApi';
import type { FeatureData } from '~types/feature';

interface MyComponentProps {
    id: number;
    onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ id, onAction }) => {
    const [state, setState] = useState<string>('');

    const { data } = useSuspenseQuery({
        queryKey: ['feature', id],
        queryFn: () => featureApi.getFeature(id),
    });

    const handleAction = useCallback(() => {
        setState('updated');
        onAction?.();
    }, [onAction]);

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ p: 3 }}>
                {/* Content */}
            </Paper>
        </Box>
    );
};

export default MyComponent;
```

For complete examples, see [resources/complete-examples.md](resources/complete-examples.md)

---

## Related Skills

- **error-tracking**: Error tracking with Sentry (applies to frontend too)
- **backend-dev-guidelines**: Backend API patterns that frontend consumes

---

**Skill Status**: Modular structure with progressive loading for optimal context management
---
### Skill: better-auth


# Better Auth Skill

Better Auth is comprehensive, framework-agnostic authentication/authorization framework for TypeScript with built-in email/password, social OAuth, and powerful plugin ecosystem for advanced features.

## When to Use

- Implementing auth in TypeScript/JavaScript applications
- Adding email/password or social OAuth authentication
- Setting up 2FA, passkeys, magic links, advanced auth features
- Building multi-tenant apps with organization support
- Managing sessions and user lifecycle
- Working with any framework (Next.js, Nuxt, SvelteKit, Remix, Astro, Hono, Express, etc.)

## Quick Start

### Installation

```bash
npm install better-auth
# or pnpm/yarn/bun add better-auth
```

### Environment Setup

Create `.env`:
```env
BETTER_AUTH_SECRET=<generated-secret-32-chars-min>
BETTER_AUTH_URL=http://localhost:3000
```

### Basic Server Setup

Create `auth.ts` (root, lib/, utils/, or under src/app/server/):

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    // See references/database-integration.md
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }
  }
});
```

### Database Schema

```bash
npx @better-auth/cli generate  # Generate schema/migrations
npx @better-auth/cli migrate   # Apply migrations (Kysely only)
```

### Mount API Handler

**Next.js App Router:**
```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

**Other frameworks:** See references/email-password-auth.md#framework-setup

### Client Setup

Create `auth-client.ts`:

```ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
});
```

### Basic Usage

```ts
// Sign up
await authClient.signUp.email({
  email: "user@example.com",
  password: "secure123",
  name: "John Doe"
});

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "secure123"
});

// OAuth
await authClient.signIn.social({ provider: "github" });

// Session
const { data: session } = authClient.useSession(); // React/Vue/Svelte
const { data: session } = await authClient.getSession(); // Vanilla JS
```

## Feature Selection Matrix

| Feature | Plugin Required | Use Case | Reference |
|---------|----------------|----------|-----------|
| Email/Password | No (built-in) | Basic auth | [email-password-auth.md](./references/email-password-auth.md) |
| OAuth (GitHub, Google, etc.) | No (built-in) | Social login | [oauth-providers.md](./references/oauth-providers.md) |
| Email Verification | No (built-in) | Verify email addresses | [email-password-auth.md](./references/email-password-auth.md#email-verification) |
| Password Reset | No (built-in) | Forgot password flow | [email-password-auth.md](./references/email-password-auth.md#password-reset) |
| Two-Factor Auth (2FA/TOTP) | Yes (`twoFactor`) | Enhanced security | [advanced-features.md](./references/advanced-features.md#two-factor-authentication) |
| Passkeys/WebAuthn | Yes (`passkey`) | Passwordless auth | [advanced-features.md](./references/advanced-features.md#passkeys-webauthn) |
| Magic Link | Yes (`magicLink`) | Email-based login | [advanced-features.md](./references/advanced-features.md#magic-link) |
| Username Auth | Yes (`username`) | Username login | [email-password-auth.md](./references/email-password-auth.md#username-authentication) |
| Organizations/Multi-tenant | Yes (`organization`) | Team/org features | [advanced-features.md](./references/advanced-features.md#organizations) |
| Rate Limiting | No (built-in) | Prevent abuse | [advanced-features.md](./references/advanced-features.md#rate-limiting) |
| Session Management | No (built-in) | User sessions | [advanced-features.md](./references/advanced-features.md#session-management) |

## Auth Method Selection Guide

**Choose Email/Password when:**
- Building standard web app with traditional auth
- Need full control over user credentials
- Targeting users who prefer email-based accounts

**Choose OAuth when:**
- Want quick signup with minimal friction
- Users already have social accounts
- Need access to social profile data

**Choose Passkeys when:**
- Want passwordless experience
- Targeting modern browsers/devices
- Security is top priority

**Choose Magic Link when:**
- Want passwordless without WebAuthn complexity
- Targeting email-first users
- Need temporary access links

**Combine Multiple Methods when:**
- Want flexibility for different user preferences
- Building enterprise apps with various auth requirements
- Need progressive enhancement (start simple, add more options)

## Core Architecture

Better Auth uses client-server architecture:
1. **Server** (`better-auth`): Handles auth logic, database ops, API routes
2. **Client** (`better-auth/client`): Provides hooks/methods for frontend
3. **Plugins**: Extend both server/client functionality

## Implementation Checklist

- [ ] Install `better-auth` package
- [ ] Set environment variables (SECRET, URL)
- [ ] Create auth server instance with database config
- [ ] Run schema migration (`npx @better-auth/cli generate`)
- [ ] Mount API handler in framework
- [ ] Create client instance
- [ ] Implement sign-up/sign-in UI
- [ ] Add session management to components
- [ ] Set up protected routes/middleware
- [ ] Add plugins as needed (regenerate schema after)
- [ ] Test complete auth flow
- [ ] Configure email sending (verification/reset)
- [ ] Enable rate limiting for production
- [ ] Set up error handling

## Reference Documentation

### Core Authentication
- [Email/Password Authentication](./references/email-password-auth.md) - Email/password setup, verification, password reset, username auth
- [OAuth Providers](./references/oauth-providers.md) - Social login setup, provider configuration, token management
- [Database Integration](./references/database-integration.md) - Database adapters, schema setup, migrations

### Advanced Features
- [Advanced Features](./references/advanced-features.md) - 2FA/MFA, passkeys, magic links, organizations, rate limiting, session management

## Scripts

- `scripts/better_auth_init.py` - Initialize Better Auth configuration with interactive setup

## Resources

- Docs: https://www.better-auth.com/docs
- GitHub: https://github.com/better-auth/better-auth
- Plugins: https://www.better-auth.com/docs/plugins
- Examples: https://www.better-auth.com/docs/examples

---
### Skill: payment-integration


# Payment Integration

Production-proven payment processing patterns with SePay (Vietnamese bank transfers), Polar (global SaaS monetization), and Stripe (global payment infrastructure). Includes multi-provider order management, currency conversion, commission systems, and webhook handling.

## When to Use

Use when implementing:
- Payment gateway integration (checkout, processing)
- Subscription management (trials, upgrades, billing)
- Webhook handling (payment notifications, idempotency)
- QR code payments (VietQR, NAPAS)
- Usage-based billing (metering, credits)
- Automated benefit delivery (licenses, GitHub access, Discord roles)
- Customer portals (self-service management)
- Bank transfer automation (Vietnamese banks)
- Product catalogs with pricing
- Multi-provider order management (Polar + SePay)
- Currency conversion (USD/VND with fallback chains)
- Commission and referral systems
- Revenue tracking and maintainer payouts
- Discount management and cross-provider sync

## Platform Selection

**Choose SePay for:**
- Vietnamese market (VND currency)
- Bank transfer automation
- VietQR/NAPAS payments
- Local payment methods
- Direct bank account monitoring

**Choose Polar for:**
- Global SaaS products
- Subscription management
- Usage-based billing
- Automated benefits (GitHub, Discord, licenses)
- Merchant of Record (tax compliance)
- Digital product sales

**Choose Stripe for:**
- Global payment infrastructure
- Enterprise-grade payment processing
- Connect platforms (marketplaces)
- Billing/subscriptions at scale
- Custom checkout experiences
- Payment Element integrations

## Quick Reference

### SePay Integration
- **Overview & Auth**: `references/sepay/overview.md` - Platform capabilities, API/OAuth2 auth, supported banks
- **API Reference**: `references/sepay/api.md` - Endpoints, transactions, bank accounts, virtual accounts
- **Webhooks**: `references/sepay/webhooks.md` - Setup, payload structure, verification, retry logic
- **SDK Usage**: `references/sepay/sdk.md` - Node.js, PHP, Laravel implementations
- **QR Codes**: `references/sepay/qr-codes.md` - VietQR generation, templates, integration
- **Best Practices**: `references/sepay/best-practices.md` - Transaction parsing, order matching, webhook handling, currency conversion, invoice generation, error handling

### Polar Integration
- **Overview & Auth**: `references/polar/overview.md` - Platform capabilities, authentication methods, MoR concept
- **Products & Pricing**: `references/polar/products.md` - Product types, pricing models, usage-based billing
- **Checkouts**: `references/polar/checkouts.md` - Checkout flows, embedded checkout, links
- **Subscriptions**: `references/polar/subscriptions.md` - Lifecycle, upgrades, downgrades, trials
- **Webhooks**: `references/polar/webhooks.md` - Event types, signature verification, monitoring
- **Benefits**: `references/polar/benefits.md` - Automated delivery (GitHub, Discord, licenses, files)
- **SDK Usage**: `references/polar/sdk.md` - TypeScript, Python, PHP, Go, framework adapters
- **Best Practices**: `references/polar/best-practices.md` - SDK initialization, checkout flows, webhooks, fee calculations, discount management, error handling

### Multi-Provider Patterns
- **Order Management**: `references/multi-provider-order-management-patterns.md` - Unified order schema, currency conversion, commissions, revenue tracking, refunds, webhook idempotency

### Stripe Integration
- **Full Documentation**: https://docs.stripe.com/llms.txt - Complete Stripe docs for LLMs
- **SDKs**: `references/stripe/stripe-sdks.md` - Node.js, Python, Ruby, Go, PHP, Java, .NET setup & usage
- **Stripe.js**: `references/stripe/stripe-js.md` - Client-side Elements, Payment Element, Embedded Checkout
- **CLI**: `references/stripe/stripe-cli.md` - Webhook testing, logs, fixtures, local development
- **Best Practices**: `references/stripe/stripe-best-practices.md` - Integration design, API selection, Checkout vs Payment Element
- **Upgrading**: `references/stripe/stripe-upgrade.md` - API versions, SDK upgrades, Stripe.js versioning
- **External Docs**: https://docs.stripe.com/sdks | https://docs.stripe.com/js | https://docs.stripe.com/cli

### Integration Scripts
- **SePay Webhook Verification**: `scripts/sepay-webhook-verify.js` - Verify SePay webhook authenticity
- **Polar Webhook Verification**: `scripts/polar-webhook-verify.js` - Verify Polar webhook signatures
- **Checkout Helper**: `scripts/checkout-helper.js` - Generate checkout sessions for both platforms

## Implementation Workflow

### SePay Implementation
1. Load `references/sepay/overview.md` for auth setup
2. Load `references/sepay/api.md` or `references/sepay/sdk.md` for integration
3. Load `references/sepay/webhooks.md` for payment notifications
4. Use `scripts/sepay-webhook-verify.js` for webhook verification
5. Load `references/sepay/best-practices.md` for production readiness

### Polar Implementation
1. Load `references/polar/overview.md` for auth and concepts
2. Load `references/polar/products.md` for product setup
3. Load `references/polar/checkouts.md` for payment flows
4. Load `references/polar/webhooks.md` for event handling
5. Use `scripts/polar-webhook-verify.js` for webhook verification
6. Load `references/polar/benefits.md` if automating delivery
7. Load `references/polar/best-practices.md` for production readiness

### Stripe Implementation
1. Load `references/stripe/stripe-best-practices.md` for integration design
2. Load `references/stripe/stripe-sdks.md` for server-side SDK setup
3. Load `references/stripe/stripe-js.md` for client-side Elements/Checkout
4. Use `stripe listen` via CLI for local webhook testing (`references/stripe/stripe-cli.md`)
5. Choose integration: Checkout (hosted/embedded) or Payment Element
6. Use CheckoutSessions API for most payment flows
7. Use Billing APIs for subscriptions (combine with Checkout)
8. Load `references/stripe/stripe-upgrade.md` when upgrading API versions

## Key Capabilities

**SePay:**
- Payment gateway (QR, bank transfer, cards)
- Bank account monitoring with webhooks
- Order-based virtual accounts
- VietQR generation API
- 44+ Vietnamese banks supported
- Rate limit: 2 calls/second

**Polar:**
- Merchant of Record (global tax compliance)
- Subscription lifecycle management
- Usage-based billing (events, meters)
- Automated benefits (GitHub, Discord, licenses)
- Customer portal (self-service)
- Multi-language SDKs
- Rate limit: 300 req/min

**Stripe:**
- Global payment infrastructure
- CheckoutSessions, PaymentIntents, SetupIntents APIs
- Billing/subscriptions with trials, prorations
- Connect for marketplaces/platforms
- Payment Element for custom UI
- Multi-language SDKs

## Instructions

1. Identify platform (Vietnamese → SePay, global SaaS → Polar/Stripe)
2. Load relevant references progressively
3. Implement auth → products → checkout → webhooks → events
4. Test in sandbox, then production
5. Load only needed references to maintain context efficiency

---
### Skill: shopify


# Shopify Development

Comprehensive guide for building on Shopify platform: apps, extensions, themes, and API integrations.

## Platform Overview

**Core Components:**
- **Shopify CLI** - Development workflow tool
- **GraphQL Admin API** - Primary API for data operations (recommended)
- **REST Admin API** - Legacy API (maintenance mode)
- **Polaris UI** - Design system for consistent interfaces
- **Liquid** - Template language for themes

**Extension Points:**
- Checkout UI - Customize checkout experience
- Admin UI - Extend admin dashboard
- POS UI - Point of Sale customization
- Customer Account - Post-purchase pages
- Theme App Extensions - Embedded theme functionality

## Quick Start

### Prerequisites

```bash
# Install Shopify CLI
npm install -g @shopify/cli@latest

# Verify installation
shopify version
```

### Create New App

```bash
# Initialize app
shopify app init

# Start development server
shopify app dev

# Generate extension
shopify app generate extension --type checkout_ui_extension

# Deploy
shopify app deploy
```

### Theme Development

```bash
# Initialize theme
shopify theme init

# Start local preview
shopify theme dev

# Pull from store
shopify theme pull --live

# Push to store
shopify theme push --development
```

## Development Workflow

### 1. App Development

**Setup:**
```bash
shopify app init
cd my-app
```

**Configure Access Scopes** (`shopify.app.toml`):
```toml
[access_scopes]
scopes = "read_products,write_products,read_orders"
```

**Start Development:**
```bash
shopify app dev  # Starts local server with tunnel
```

**Add Extensions:**
```bash
shopify app generate extension --type checkout_ui_extension
```

**Deploy:**
```bash
shopify app deploy  # Builds and uploads to Shopify
```

### 2. Extension Development

**Available Types:**
- Checkout UI - `checkout_ui_extension`
- Admin Action - `admin_action`
- Admin Block - `admin_block`
- POS UI - `pos_ui_extension`
- Function - `function` (discounts, payment, delivery, validation)

**Workflow:**
```bash
shopify app generate extension
# Select type, configure
shopify app dev  # Test locally
shopify app deploy  # Publish
```

### 3. Theme Development

**Setup:**
```bash
shopify theme init
# Choose Dawn (reference theme) or start fresh
```

**Local Development:**
```bash
shopify theme dev
# Preview at localhost:9292
# Auto-syncs to development theme
```

**Deployment:**
```bash
shopify theme push --development  # Push to dev theme
shopify theme publish --theme=123  # Set as live
```

## When to Build What

### Build an App When:
- Integrating external services
- Adding functionality across multiple stores
- Building merchant-facing admin tools
- Managing store data programmatically
- Implementing complex business logic
- Charging for functionality

### Build an Extension When:
- Customizing checkout flow
- Adding fields/features to admin pages
- Creating POS actions for retail
- Implementing discount/payment/shipping rules
- Extending customer account pages

### Build a Theme When:
- Creating custom storefront design
- Building unique shopping experiences
- Customizing product/collection pages
- Implementing brand-specific layouts
- Modifying homepage/content pages

### Combination Approach:
**App + Theme Extension:**
- App handles backend logic and data
- Theme extension provides storefront UI
- Example: Product reviews, wishlists, size guides

## Essential Patterns

### GraphQL Product Query

```graphql
query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        handle
        variants(first: 5) {
          edges {
            node {
              id
              price
              inventoryQuantity
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Checkout Extension (React)

```javascript
import { reactExtension, BlockStack, TextField, Checkbox } from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
  const [message, setMessage] = useState('');

  return (
    <BlockStack>
      <TextField label="Gift Message" value={message} onChange={setMessage} />
    </BlockStack>
  );
}
```

### Liquid Product Display

```liquid
{% for product in collection.products %}
  <div class="product-card">
    <img src="{{ product.featured_image | img_url: 'medium' }}" alt="{{ product.title }}">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
    <a href="{{ product.url }}">View Details</a>
  </div>
{% endfor %}
```

## Best Practices

**API Usage:**
- Prefer GraphQL over REST for new development
- Request only needed fields to reduce costs
- Implement pagination for large datasets
- Use bulk operations for batch processing
- Respect rate limits (cost-based for GraphQL)

**Security:**
- Store API credentials in environment variables
- Verify webhook signatures
- Use OAuth for public apps
- Request minimal access scopes
- Implement session tokens for embedded apps

**Performance:**
- Cache API responses when appropriate
- Optimize images in themes
- Minimize Liquid logic complexity
- Use async loading for extensions
- Monitor query costs in GraphQL

**Testing:**
- Use development stores for testing
- Test across different store plans
- Verify mobile responsiveness
- Check accessibility (keyboard, screen readers)
- Validate GDPR compliance

## Reference Documentation

Detailed guides for advanced topics:

- **[App Development](references/app-development.md)** - OAuth, APIs, webhooks, billing
- **[Extensions](references/extensions.md)** - Checkout, Admin, POS, Functions
- **[Themes](references/themes.md)** - Liquid, sections, deployment

## Scripts

**[shopify_init.py](scripts/shopify_init.py)** - Initialize Shopify projects interactively
```bash
python scripts/shopify_init.py
```

## Troubleshooting

**Rate Limit Errors:**
- Monitor `X-Shopify-Shop-Api-Call-Limit` header
- Implement exponential backoff
- Use bulk operations for large datasets

**Authentication Failures:**
- Verify access token validity
- Check required scopes granted
- Ensure OAuth flow completed

**Extension Not Appearing:**
- Verify extension target correct
- Check extension published
- Ensure app installed on store

**Webhook Not Receiving:**
- Verify webhook URL accessible
- Check signature validation
- Review logs in Partner Dashboard

## Resources

**Official Documentation:**
- Shopify Docs: https://shopify.dev/docs
- GraphQL API: https://shopify.dev/docs/api/admin-graphql
- Shopify CLI: https://shopify.dev/docs/api/shopify-cli
- Polaris: https://polaris.shopify.com

**Tools:**
- GraphiQL Explorer (Admin → Settings → Apps → Develop apps)
- Partner Dashboard (app management)
- Development stores (free testing)

**API Versioning:**
- Quarterly releases (YYYY-MM format)
- Current: 2025-01
- 12-month support per version
- Test before version updates

---

**Note:** This skill covers Shopify platform as of January 2025. Refer to official documentation for latest updates.

---
### Skill: devops


# DevOps Skill

Comprehensive guide for deploying and managing cloud infrastructure across Cloudflare edge platform, Docker containerization, and Google Cloud Platform.

## When to Use This Skill

Use this skill when:
- Deploying serverless applications to Cloudflare Workers
- Containerizing applications with Docker
- Managing Google Cloud infrastructure with gcloud CLI
- Setting up CI/CD pipelines across platforms
- Optimizing cloud infrastructure costs
- Implementing multi-region deployments
- Building edge-first architectures
- Managing container orchestration with Kubernetes
- Configuring cloud storage solutions (R2, Cloud Storage)
- Automating infrastructure with scripts and IaC

## Platform Selection Guide

### When to Use Cloudflare

**Best For:**
- Edge-first applications with global distribution
- Ultra-low latency requirements (<50ms)
- Static sites with serverless functions
- Zero egress cost scenarios (R2 storage)
- WebSocket/real-time applications (Durable Objects)
- AI/ML at the edge (Workers AI)

**Key Products:**
- Workers (serverless functions)
- R2 (object storage, S3-compatible)
- D1 (SQLite database with global replication)
- KV (key-value store)
- Pages (static hosting + functions)
- Durable Objects (stateful compute)
- Browser Rendering (headless browser automation)

**Cost Profile:** Pay-per-request, generous free tier, zero egress fees

### When to Use Docker

**Best For:**
- Local development consistency
- Microservices architectures
- Multi-language stack applications
- Traditional VPS/VM deployments
- Kubernetes orchestration
- CI/CD build environments
- Database containerization (dev/test)

**Key Capabilities:**
- Application isolation and portability
- Multi-stage builds for optimization
- Docker Compose for multi-container apps
- Volume management for data persistence
- Network configuration and service discovery
- Cross-platform compatibility (amd64, arm64)

**Cost Profile:** Infrastructure cost only (compute + storage)

### When to Use Google Cloud

**Best For:**
- Enterprise-scale applications
- Data analytics and ML pipelines (BigQuery, Vertex AI)
- Hybrid/multi-cloud deployments
- Kubernetes at scale (GKE)
- Managed databases (Cloud SQL, Firestore, Spanner)
- Complex IAM and compliance requirements

**Key Services:**
- Compute Engine (VMs)
- GKE (managed Kubernetes)
- Cloud Run (containerized serverless)
- App Engine (PaaS)
- Cloud Storage (object storage)
- Cloud SQL (managed databases)

**Cost Profile:** Varied pricing, sustained use discounts, committed use contracts

## Quick Start

### Cloudflare Workers

```bash
# Install Wrangler CLI
npm install -g wrangler

# Create and deploy Worker
wrangler init my-worker
cd my-worker
wrangler deploy
```

See: `references/cloudflare-workers-basics.md`

### Docker Container

```bash
# Create Dockerfile
cat > Dockerfile <<EOF
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
EOF

# Build and run
docker build -t myapp .
docker run -p 3000:3000 myapp
```

See: `references/docker-basics.md`

### Google Cloud Deployment

```bash
# Install and authenticate
curl https://sdk.cloud.google.com | bash
gcloud init
gcloud auth login

# Deploy to Cloud Run
gcloud run deploy my-service \
  --image gcr.io/project/image \
  --region us-central1
```

See: `references/gcloud-platform.md`

## Reference Navigation

### Cloudflare Platform
- `cloudflare-platform.md` - Edge computing overview, key components
- `cloudflare-workers-basics.md` - Getting started, handler types, basic patterns
- `cloudflare-workers-advanced.md` - Advanced patterns, performance, optimization
- `cloudflare-workers-apis.md` - Runtime APIs, bindings, integrations
- `cloudflare-r2-storage.md` - R2 object storage, S3 compatibility, best practices
- `cloudflare-d1-kv.md` - D1 SQLite database, KV store, use cases
- `browser-rendering.md` - Puppeteer/Playwright automation on Cloudflare

### Docker Containerization
- `docker-basics.md` - Core concepts, Dockerfile, images, containers
- `docker-compose.md` - Multi-container apps, networking, volumes

### Google Cloud Platform
- `gcloud-platform.md` - GCP overview, gcloud CLI, authentication
- `gcloud-services.md` - Compute Engine, GKE, Cloud Run, App Engine

### Python Utilities
- `scripts/cloudflare-deploy.py` - Automate Cloudflare Worker deployments
- `scripts/docker-optimize.py` - Analyze and optimize Dockerfiles

## Common Workflows

### Edge + Container Hybrid

```yaml
# Cloudflare Workers (API Gateway)
# -> Docker containers on Cloud Run (Backend Services)
# -> R2 (Object Storage)

# Benefits:
# - Edge caching and routing
# - Containerized business logic
# - Global distribution
```

### Multi-Stage Docker Build

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER node
CMD ["node", "dist/server.js"]
```

### CI/CD Pipeline Pattern

```yaml
# 1. Build: Docker multi-stage build
# 2. Test: Run tests in container
# 3. Push: Push to registry (GCR, Docker Hub)
# 4. Deploy: Deploy to Cloudflare Workers / Cloud Run
# 5. Verify: Health checks and smoke tests
```

## Best Practices

### Security
- Run containers as non-root user
- Use service account impersonation (GCP)
- Store secrets in environment variables, not code
- Scan images for vulnerabilities (Docker Scout)
- Use API tokens with minimal permissions

### Performance
- Multi-stage Docker builds to reduce image size
- Edge caching with Cloudflare KV
- Use R2 for zero egress cost storage
- Implement health checks for containers
- Set appropriate timeouts and resource limits

### Cost Optimization
- Use Cloudflare R2 instead of S3 for large egress
- Implement caching strategies (edge + KV)
- Right-size container resources
- Use sustained use discounts (GCP)
- Monitor usage with cloud provider dashboards

### Development
- Use Docker Compose for local development
- Wrangler dev for local Worker testing
- Named gcloud configurations for multi-environment
- Version control infrastructure code
- Implement automated testing in CI/CD

## Decision Matrix

| Need | Choose |
|------|--------|
| Sub-50ms latency globally | Cloudflare Workers |
| Large file storage (zero egress) | Cloudflare R2 |
| SQL database (global reads) | Cloudflare D1 |
| Containerized workloads | Docker + Cloud Run/GKE |
| Enterprise Kubernetes | GKE |
| Managed relational DB | Cloud SQL |
| Static site + API | Cloudflare Pages |
| WebSocket/real-time | Cloudflare Durable Objects |
| ML/AI pipelines | GCP Vertex AI |
| Browser automation | Cloudflare Browser Rendering |

## Resources

- **Cloudflare Docs:** https://developers.cloudflare.com
- **Docker Docs:** https://docs.docker.com
- **GCP Docs:** https://cloud.google.com/docs
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/
- **gcloud CLI:** https://cloud.google.com/sdk/gcloud

## Implementation Checklist

### Cloudflare Workers
- [ ] Install Wrangler CLI
- [ ] Create Worker project
- [ ] Configure wrangler.toml (bindings, routes)
- [ ] Test locally with `wrangler dev`
- [ ] Deploy with `wrangler deploy`

### Docker
- [ ] Write Dockerfile with multi-stage builds
- [ ] Create .dockerignore file
- [ ] Test build locally
- [ ] Push to registry
- [ ] Deploy to target platform

### Google Cloud
- [ ] Install gcloud CLI
- [ ] Authenticate with service account
- [ ] Create project and enable APIs
- [ ] Configure IAM permissions
- [ ] Deploy and monitor resources

---
### Skill: git


# Git Operations

Execute git workflows via `git-manager` subagent to isolate verbose output.
Activate `context-engineering` skill.

**IMPORTANT:**
- Sacrifice grammar for the sake of concision.
- Ensure token efficiency while maintaining high quality.
- Pass these rules to subagents.

## Arguments
- `cm`: Stage files & create commits
- `cp`: Stage files, create commits and push
- `pr`: Create Pull Request [to-branch] [from-branch]
  - `to-branch`: Target branch (default: main)
  - `from-branch`: Source branch (default: current branch)
- `merge`: Merge [to-branch] [from-branch]
  - `to-branch`: Target branch (default: main)
  - `from-branch`: Source branch (default: current branch)

## Quick Reference

| Task | Reference |
|------|-----------|
| Commit | `references/workflow-commit.md` |
| Push | `references/workflow-push.md` |
| Pull Request | `references/workflow-pr.md` |
| Merge | `references/workflow-merge.md` |
| Standards | `references/commit-standards.md` |
| Safety | `references/safety-protocols.md` |
| Branches | `references/branch-management.md` |
| GitHub CLI | `references/gh-cli-guide.md` |

## Core Workflow

### Step 1: Stage + Analyze
```bash
git add -A && git diff --cached --stat && git diff --cached --name-only
```

### Step 2: Security Check
Scan for secrets before commit:
```bash
git diff --cached | grep -iE "(api[_-]?key|token|password|secret|credential)"
```
**If secrets found:** STOP, warn user, suggest `.gitignore`.

### Step 3: Split Decision

NOTE: Search for related issues on GitHub and add to body.

**Split commits if:**
- Different types mixed (feat + fix, code + docs)
- Multiple scopes (auth + payments)
- Config/deps + code mixed
- FILES > 10 unrelated

**Single commit if:**
- Same type/scope, FILES ≤ 3, LINES ≤ 50

### Step 4: Commit
```bash
git commit -m "type(scope): description"
```

## Output Format
```
✓ staged: N files (+X/-Y lines)
✓ security: passed
✓ commit: HASH type(scope): description
✓ pushed: yes/no
```

## Error Handling

| Error | Action |
|-------|--------|
| Secrets detected | Block commit, show files |
| No changes | Exit cleanly |
| Push rejected | Suggest `git pull --rebase` |
| Merge conflicts | Suggest manual resolution |

## References

- `references/workflow-commit.md` - Commit workflow with split logic
- `references/workflow-push.md` - Push workflow with error handling
- `references/workflow-pr.md` - PR creation with remote diff analysis
- `references/workflow-merge.md` - Branch merge workflow
- `references/commit-standards.md` - Conventional commit format rules
- `references/safety-protocols.md` - Secret detection, branch protection
- `references/branch-management.md` - Naming, lifecycle, strategies
- `references/gh-cli-guide.md` - GitHub CLI commands reference

---
### Skill: chrome-devtools


# Chrome DevTools Agent Skill

Browser automation via Puppeteer scripts with persistent sessions. All scripts output JSON.

## Skill Location

Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.

```bash
# Detect skill location
SKILL_DIR=""
if [ -d ".opencode/skills/chrome-devtools/scripts" ]; then
  SKILL_DIR=".opencode/skills/chrome-devtools/scripts"
elif [ -d "$HOME/.opencode/skills/chrome-devtools/scripts" ]; then
  SKILL_DIR="$HOME/.opencode/skills/chrome-devtools/scripts"
fi
cd "$SKILL_DIR"
```

## Choosing Your Approach

| Scenario | Approach |
|----------|----------|
| **Source-available sites** | Read source code first, write selectors directly |
| **Unknown layouts** | Use `aria-snapshot.js` for semantic discovery |
| **Visual inspection** | Take screenshots to verify rendering |
| **Debug issues** | Collect console logs, analyze with session storage |
| **Accessibility audit** | Use ARIA snapshot for semantic structure analysis |

## Automation Browsing Running Mode

- Detect current OS and launch browser as headless only when running on Linux, WSL, or CI environments.
- For macOS/Windows, browser always runs in headed mode for better debugging.
- Run multiple scripts/sessions in parallel to simulate real user interactions.
- Run multiple scripts/sessions in parallel to simulate different device types (mobile, tablet, desktop).
- Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.

## ARIA Snapshot (Element Discovery)

When page structure is unknown, use `aria-snapshot.js` to get a YAML-formatted accessibility tree with semantic roles, accessible names, states, and stable element references.

### Get ARIA Snapshot

```bash
# Generate ARIA snapshot and output to stdout
node aria-snapshot.js --url https://example.com

# Save to file in snapshots directory
node aria-snapshot.js --url https://example.com --output ./.opencode/chrome-devtools/snapshots/page.yaml
```

### Example YAML Output

```yaml
- banner:
  - link "Hacker News" [ref=e1]
    /url: https://news.ycombinator.com
  - navigation:
    - link "new" [ref=e2]
    - link "past" [ref=e3]
    - link "comments" [ref=e4]
- main:
  - list:
    - listitem:
      - link "Show HN: My new project" [ref=e8]
      - text: "128 points by user 3 hours ago"
- contentinfo:
  - textbox [ref=e10]
    /placeholder: "Search"
```

### Interpreting ARIA Notation

| Notation | Meaning |
|----------|---------|
| `[ref=eN]` | Stable identifier for interactive elements |
| `[checked]` | Checkbox/radio is selected |
| `[disabled]` | Element is inactive |
| `[expanded]` | Accordion/dropdown is open |
| `[level=N]` | Heading hierarchy (1-6) |
| `/url:` | Link destination |
| `/placeholder:` | Input placeholder text |
| `/value:` | Current input value |

### Interact by Ref

Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.
Use `select-ref.js` to interact with elements by their ref:

```bash
# Click element with ref e5
node select-ref.js --ref e5 --action click

# Fill input with ref e10
node select-ref.js --ref e10 --action fill --value "search query"

# Get text content
node select-ref.js --ref e8 --action text

# Screenshot specific element
node select-ref.js --ref e1 --action screenshot --output ./logo.png

# Focus element
node select-ref.js --ref e10 --action focus

# Hover over element
node select-ref.js --ref e5 --action hover
```

### Store Snapshots

Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.
Store snapshots for analysis in `<project>/.opencode/chrome-devtools/snapshots/`:

```bash
# Create snapshots directory
mkdir -p .opencode/chrome-devtools/snapshots

# Capture and store with timestamp
SESSION="$(date +%Y%m%d-%H%M%S)"
node aria-snapshot.js --url https://example.com --output .opencode/chrome-devtools/snapshots/$SESSION.yaml
```

### Workflow: Unknown Page Structure

1. **Get snapshot** to discover elements:
   ```bash
   node aria-snapshot.js --url https://example.com
   ```

2. **Identify target** from YAML output (e.g., `[ref=e5]` for a button)

3. **Interact by ref**:
   ```bash
   node select-ref.js --ref e5 --action click
   ```

4. **Verify result** with screenshot or new snapshot:
   ```bash
   node screenshot.js --output ./result.png
   ```

## Local HTML Files

Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.
**IMPORTANT**: Never browse local HTML files via `file://` protocol. Always serve via local server:
**Why**: `file://` protocol blocks many browser features (CORS, ES modules, fetch API, service workers). Local server ensures proper HTTP behavior.

```bash
# Option 1: npx serve (recommended)
npx serve ./dist -p 3000 &
node navigate.js --url http://localhost:3000

# Option 2: Python http.server
python -m http.server 3000 --directory ./dist &
node navigate.js --url http://localhost:3000
```

**Note**: when port 3000 is busy, find an available port with `lsof -i :3000` and use a different one.

## Quick Start

```bash
# Install dependencies
cd .opencode/skills/chrome-devtools/scripts
npm install  # Installs puppeteer, sharp, debug, yargs

# Test (browser stays running for session reuse)
node navigate.js --url https://example.com
# Output: {"success": true, "url": "...", "title": "..."}
```

**Linux/WSL only**: Run `./install-deps.sh` first for Chrome system libraries.

## Session Persistence

Browser state persists across script executions via WebSocket endpoint file (`.browser-session.json`).

**Default behavior**: Scripts disconnect but keep browser running for session reuse.

```bash
# First script: launches browser, navigates, disconnects (browser stays running)
node navigate.js --url https://example.com/login

# Subsequent scripts: connect to existing browser, reuse page state
node fill.js --selector "#email" --value "user@example.com"
node fill.js --selector "#password" --value "secret"
node click.js --selector "button[type=submit]"

# Close browser when done
node navigate.js --url about:blank --close true
```

**Session management**:
- `--close true`: Close browser and clear session
- Default (no flag): Keep browser running for next script

## Available Scripts

Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.
All in `.opencode/skills/chrome-devtools/scripts/`:

| Script | Purpose |
|--------|---------|
| `navigate.js` | Navigate to URLs |
| `screenshot.js` | Capture screenshots (auto-compress >5MB via Sharp) |
| `click.js` | Click elements |
| `fill.js` | Fill form fields |
| `evaluate.js` | Execute JS in page context |
| `snapshot.js` | Extract interactive elements (JSON format) |
| `aria-snapshot.js` | Get ARIA accessibility tree (YAML format with refs) |
| `select-ref.js` | Interact with elements by ref from ARIA snapshot |
| `console.js` | Monitor console messages/errors |
| `network.js` | Track HTTP requests/responses |
| `performance.js` | Measure Core Web Vitals |

## Workflow Loop

1. **Execute** focused script for single task
2. **Observe** JSON output
3. **Assess** completion status
4. **Decide** next action
5. **Repeat** until done

## Writing Custom Test Scripts

Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.
For complex automation, write scripts to `<project>/.opencode/chrome-devtools/tmp/`:

```bash
# Create tmp directory for test scripts
mkdir -p $SKILL_DIR/.opencode/chrome-devtools/tmp

# Write a test script
cat > $SKILL_DIR/.opencode/chrome-devtools/tmp/login-test.js << 'EOF'
import { getBrowser, getPage, disconnectBrowser, outputJSON } from '../scripts/lib/browser.js';

async function loginTest() {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await page.goto('https://example.com/login');
  await page.type('#email', 'user@example.com');
  await page.type('#password', 'secret');
  await page.click('button[type=submit]');
  await page.waitForNavigation();

  outputJSON({
    success: true,
    url: page.url(),
    title: await page.title()
  });

  await disconnectBrowser();
}

loginTest();
EOF

# Run the test
node $SKILL_DIR/.opencode/chrome-devtools/tmp/login-test.js
```

**Key principles for custom scripts**:
- Single-purpose: one script, one task
- Always call `disconnectBrowser()` at the end (keeps browser running)
- Use `closeBrowser()` only when ending session completely
- Output JSON for easy parsing
- Plain JavaScript only in `page.evaluate()` callbacks

## Screenshots

Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.
Store screenshots for analysis in `<project>/.opencode/chrome-devtools/screenshots/`:

```bash
# Basic screenshot
node screenshot.js --url https://example.com --output ./.opencode/chrome-devtools/screenshots/page.png

# Full page
node screenshot.js --url https://example.com --output ./.opencode/chrome-devtools/screenshots/page.png --full-page true

# Specific element
node screenshot.js --url https://example.com --selector ".main-content" --output ./.opencode/chrome-devtools/screenshots/element.png
```

### Auto-Compression (Sharp)

Screenshots >5MB auto-compress using Sharp (4-5x faster than ImageMagick):

```bash
# Default: compress if >5MB
node screenshot.js --url https://example.com --output ./.opencode/chrome-devtools/screenshots/page.png

# Custom threshold (3MB)
node screenshot.js --url https://example.com --output ./.opencode/chrome-devtools/screenshots/page.png --max-size 3

# Disable compression
node screenshot.js --url https://example.com --output ./.opencode/chrome-devtools/screenshots/page.png --no-compress
```

Store screenshots for analysis in `<project>/.opencode/chrome-devtools/screenshots/`.

## Console Log Collection & Analysis

Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.

### Capture Logs

```bash
# Capture all logs for 10 seconds
node console.js --url https://example.com --duration 10000

# Filter by type
node console.js --url https://example.com --types error,warn --duration 5000
```

### Session Storage Pattern

Store logs for analysis in `<project>/.opencode/chrome-devtools/logs/<session>/`:

```bash
# Create session directory
SESSION="$(date +%Y%m%d-%H%M%S)"
mkdir -p .opencode/chrome-devtools/logs/$SESSION

# Capture and store
node console.js --url https://example.com --duration 10000 > .opencode/chrome-devtools/logs/$SESSION/console.json
node network.js --url https://example.com > .opencode/chrome-devtools/logs/$SESSION/network.json

# View errors
jq '.messages[] | select(.type=="error")' .opencode/chrome-devtools/logs/$SESSION/console.json
```

### Root Cause Analysis

```bash
# 1. Check for JavaScript errors
node console.js --url https://example.com --types error,pageerror --duration 5000 | jq '.messages'

# 2. Correlate with network failures
node network.js --url https://example.com | jq '.requests[] | select(.response.status >= 400)'

# 3. Check specific error stack traces
node console.js --url https://example.com --types error --duration 5000 | jq '.messages[].stack'
```

## Finding Elements

Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.
Use `snapshot.js` to discover selectors before interacting:

```bash
# Get all interactive elements
node snapshot.js --url https://example.com | jq '.elements[] | {tagName, text, selector}'

# Find buttons
node snapshot.js --url https://example.com | jq '.elements[] | select(.tagName=="button")'

# Find by text content
node snapshot.js --url https://example.com | jq '.elements[] | select(.text | contains("Submit"))'
```

## Error Recovery

Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.
If script fails:

```bash
# 1. Capture current state (without navigating to preserve state)
node screenshot.js --output ./.opencode/skills/chrome-devtools/screenshots/debug.png

# 2. Get console errors
node console.js --url about:blank --types error --duration 1000

# 3. Discover correct selector
node snapshot.js | jq '.elements[] | select(.text | contains("Submit"))'

# 4. Try XPath if CSS fails
node click.js --selector "//button[contains(text(),'Submit')]"
```

## Common Patterns

### Web Scraping
```bash
node evaluate.js --url https://example.com --script "
  Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.querySelector('h2')?.textContent,
    link: el.querySelector('a')?.href
  }))
" | jq '.result'
```

### Form Automation
```bash
node navigate.js --url https://example.com/form
node fill.js --selector "#search" --value "query"
node click.js --selector "button[type=submit]"
```

### Performance Testing
```bash
node performance.js --url https://example.com | jq '.vitals'
```

## Script Options

All scripts support:
- `--headless false` - Show browser window
- `--close true` - Close browser completely (default: stay running)
- `--timeout 30000` - Set timeout (ms)
- `--wait-until networkidle2` - Wait strategy
Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.

## Troubleshooting
Skills can exist in **project-scope** or **user-scope**. Priority: project-scope > user-scope.

| Error | Solution |
|-------|----------|
| `Cannot find package 'puppeteer'` | Run `npm install` in scripts directory |
| `libnss3.so` missing (Linux) | Run `./install-deps.sh` |
| Element not found | Use `snapshot.js` to find correct selector |
| Script hangs | Use `--timeout 60000` or `--wait-until load` |
| Screenshot >5MB | Auto-compressed; use `--max-size 3` for lower |
| Session stale | Delete `.browser-session.json` and retry |

### Screenshot Analysis: Missing Images

If images don't appear in screenshots, they may be waiting for animation triggers:

1. **Scroll-triggered animations**: Scroll element into view first
   ```bash
   node evaluate.js --script "document.querySelector('.lazy-image').scrollIntoView()"
   # Wait for animation
   node evaluate.js --script "await new Promise(r => setTimeout(r, 1000))"
   node screenshot.js --output ./result.png
   ```

2. **Sequential animation queue**: Wait longer and retry
   ```bash
   # First attempt
   node screenshot.js --url http://localhost:3000 --output ./attempt1.png

   # Wait for animations to complete
   node evaluate.js --script "await new Promise(r => setTimeout(r, 2000))"

   # Retry screenshot
   node screenshot.js --output ./attempt2.png
   ```

3. **Intersection Observer animations**: Trigger by scrolling through page
   ```bash
   node evaluate.js --script "window.scrollTo(0, document.body.scrollHeight)"
   node evaluate.js --script "await new Promise(r => setTimeout(r, 1500))"
   node evaluate.js --script "window.scrollTo(0, 0)"
   node screenshot.js --output ./full-loaded.png --full-page true
   ```

## Reference Documentation

- `./references/cdp-domains.md` - Chrome DevTools Protocol domains
- `./references/puppeteer-reference.md` - Puppeteer API patterns
- `./references/performance-guide.md` - Core Web Vitals optimization
- `./scripts/README.md` - Detailed script options

---
### Skill: web-frameworks


# Web Frameworks Skill Group

Comprehensive guide for building modern full-stack web applications using Next.js, Turborepo, and RemixIcon.

## Overview

This skill group combines three powerful tools for web development:

**Next.js** - React framework with SSR, SSG, RSC, and optimization features
**Turborepo** - High-performance monorepo build system for JavaScript/TypeScript
**RemixIcon** - Icon library with 3,100+ outlined and filled style icons

## When to Use This Skill Group

- Building new full-stack web applications with modern React
- Setting up monorepos with multiple apps and shared packages
- Implementing server-side rendering and static generation
- Optimizing build performance with intelligent caching
- Creating consistent UI with professional iconography
- Managing workspace dependencies across multiple projects
- Deploying production-ready applications with proper optimization

## Stack Selection Guide

### Single Application: Next.js + RemixIcon

Use when building a standalone application:
- E-commerce sites
- Marketing websites
- SaaS applications
- Documentation sites
- Blogs and content platforms

**Setup:**
```bash
npx create-next-app@latest my-app
cd my-app
npm install remixicon
```

### Monorepo: Next.js + Turborepo + RemixIcon

Use when building multiple applications with shared code:
- Microfrontends
- Multi-tenant platforms
- Internal tools with shared component library
- Multiple apps (web, admin, mobile-web) sharing logic
- Design system with documentation site

**Setup:**
```bash
npx create-turbo@latest my-monorepo
# Then configure Next.js apps in apps/ directory
# Install remixicon in shared UI packages
```

### Framework Features Comparison

| Feature | Next.js | Turborepo | RemixIcon |
|---------|---------|-----------|-----------|
| Primary Use | Web framework | Build system | UI icons |
| Best For | SSR/SSG apps | Monorepos | Consistent iconography |
| Performance | Built-in optimization | Caching & parallel tasks | Lightweight fonts/SVG |
| TypeScript | Full support | Full support | Type definitions available |

## Quick Start

### Next.js Application

```bash
# Create new project
npx create-next-app@latest my-app
cd my-app

# Install RemixIcon
npm install remixicon

# Import in layout
# app/layout.tsx
import 'remixicon/fonts/remixicon.css'

# Start development
npm run dev
```

### Turborepo Monorepo

```bash
# Create monorepo
npx create-turbo@latest my-monorepo
cd my-monorepo

# Structure:
# apps/web/          - Next.js application
# apps/docs/         - Documentation site
# packages/ui/       - Shared components with RemixIcon
# packages/config/   - Shared configs
# turbo.json         - Pipeline configuration

# Run all apps
npm run dev

# Build all packages
npm run build
```

### RemixIcon Integration

```tsx
// Webfont (HTML/CSS)
<i className="ri-home-line"></i>
<i className="ri-search-fill ri-2x"></i>

// React component
import { RiHomeLine, RiSearchFill } from "@remixicon/react"
<RiHomeLine size={24} />
<RiSearchFill size={32} color="blue" />
```

## Reference Navigation

**Next.js References:**
- [App Router Architecture](./references/nextjs-app-router.md) - Routing, layouts, pages, parallel routes
- [Server Components](./references/nextjs-server-components.md) - RSC patterns, client vs server, streaming
- [Data Fetching](./references/nextjs-data-fetching.md) - fetch API, caching, revalidation, loading states
- [Optimization](./references/nextjs-optimization.md) - Images, fonts, scripts, bundle analysis, PPR

**Turborepo References:**
- [Setup & Configuration](./references/turborepo-setup.md) - Installation, workspace config, package structure
- [Task Pipelines](./references/turborepo-pipelines.md) - Dependencies, parallel execution, task ordering
- [Caching Strategies](./references/turborepo-caching.md) - Local cache, remote cache, cache invalidation

**RemixIcon References:**
- [Integration Guide](./references/remix-icon-integration.md) - Installation, usage, customization, accessibility

## Common Patterns & Workflows

### Pattern 1: Full-Stack Monorepo

```
my-monorepo/
├── apps/
│   ├── web/              # Customer-facing Next.js app
│   ├── admin/            # Admin dashboard Next.js app
│   └── docs/             # Documentation site
├── packages/
│   ├── ui/               # Shared UI with RemixIcon
│   ├── api-client/       # API client library
│   ├── config/           # ESLint, TypeScript configs
│   └── types/            # Shared TypeScript types
└── turbo.json            # Build pipeline
```

**turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### Pattern 2: Shared Component Library

```tsx
// packages/ui/src/button.tsx
import { RiLoader4Line } from "@remixicon/react"

export function Button({ children, loading, icon }) {
  return (
    <button>
      {loading ? <RiLoader4Line className="animate-spin" /> : icon}
      {children}
    </button>
  )
}

// apps/web/app/page.tsx
import { Button } from "@repo/ui/button"
import { RiHomeLine } from "@remixicon/react"

export default function Page() {
  return <Button icon={<RiHomeLine />}>Home</Button>
}
```

### Pattern 3: Optimized Data Fetching

```tsx
// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation'

// Static generation at build time
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => ({ slug: post.slug }))
}

// Revalidate every hour
async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600 }
  })
  if (!res.ok) return null
  return res.json()
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return <article>{post.content}</article>
}
```

### Pattern 4: Monorepo CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npx turbo run build test lint
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```

## Utility Scripts

Python utilities in `scripts/` directory:

**nextjs-init.py** - Initialize Next.js project with best practices
**turborepo-migrate.py** - Convert existing monorepo to Turborepo

Usage examples:
```bash
# Initialize new Next.js app with TypeScript and recommended setup
python scripts/nextjs-init.py --name my-app --typescript --app-router

# Migrate existing monorepo to Turborepo with dry-run
python scripts/turborepo-migrate.py --path ./my-monorepo --dry-run

# Run tests
cd scripts/tests
pytest
```

## Best Practices

**Next.js:**
- Default to Server Components, use Client Components only when needed
- Implement proper loading and error states
- Use Image component for automatic optimization
- Set proper metadata for SEO
- Leverage caching strategies (force-cache, revalidate, no-store)

**Turborepo:**
- Structure monorepo with clear separation (apps/, packages/)
- Define task dependencies correctly (^build for topological)
- Configure outputs for proper caching
- Enable remote caching for team collaboration
- Use filters to run tasks on changed packages only

**RemixIcon:**
- Use line style for minimal interfaces, fill for emphasis
- Maintain 24x24 grid alignment for crisp rendering
- Provide aria-labels for accessibility
- Use currentColor for flexible theming
- Prefer webfonts for multiple icons, SVG for single icons

## Resources

- Next.js: https://nextjs.org/docs/llms.txt
- Turborepo: https://turbo.build/repo/docs
- RemixIcon: https://remixicon.com

## Implementation Checklist

Building with this stack:

- [ ] Create project structure (single app or monorepo)
- [ ] Configure TypeScript and ESLint
- [ ] Set up Next.js with App Router
- [ ] Configure Turborepo pipeline (if monorepo)
- [ ] Install and configure RemixIcon
- [ ] Implement routing and layouts
- [ ] Add loading and error states
- [ ] Configure image and font optimization
- [ ] Set up data fetching patterns
- [ ] Configure caching strategies
- [ ] Add API routes as needed
- [ ] Implement shared component library (if monorepo)
- [ ] Configure remote caching (if monorepo)
- [ ] Set up CI/CD pipeline
- [ ] Configure deployment platform

---
### Skill: google-adk-python


# Google ADK Python Skill

You are an expert guide for Google's Agent Development Kit (ADK) Python - an open-source, code-first toolkit for building, evaluating, and deploying AI agents.

## When to Use This Skill

Use this skill when users need to:
- Build AI agents with tool integration and orchestration capabilities
- Create multi-agent systems with hierarchical coordination
- Implement workflow agents (sequential, parallel, loop) for predictable pipelines
- Integrate LLM-powered agents with Google Search, Code Execution, or custom tools
- Deploy agents to Vertex AI Agent Engine, Cloud Run, or custom infrastructure
- Evaluate and test agent performance systematically
- Implement human-in-the-loop approval flows for tool execution

## Core Concepts

### Agent Types

**LlmAgent**: LLM-powered agents capable of dynamic routing and adaptive behavior
- Define with name, model, instruction, description, and tools
- Supports sub-agents for delegation and coordination
- Intelligent decision-making based on context

**Workflow Agents**: Structured, predictable orchestration patterns
- **SequentialAgent**: Execute agents in defined order
- **ParallelAgent**: Run multiple agents concurrently
- **LoopAgent**: Repeat execution with iteration logic

**BaseAgent**: Foundation for custom agent implementations

### Key Components

**Tools Ecosystem**:
- Pre-built tools (google_search, code_execution)
- Custom Python functions as tools
- OpenAPI specification integration
- Tool confirmation flows for human approval

**Multi-Agent Architecture**:
- Hierarchical agent composition
- Specialized agents for specific domains
- Coordinator agents for delegation

## Installation

```bash
# Stable release (recommended)
pip install google-adk

# Development version (latest features)
pip install git+https://github.com/google/adk-python.git@main
```

## Implementation Patterns

### Single Agent with Tools

```python
from google.adk.agents import LlmAgent
from google.adk.tools import google_search

agent = LlmAgent(
    name="search_assistant",
    model="gemini-2.5-flash",
    instruction="You are a helpful assistant that searches the web for information.",
    description="Search assistant for web queries",
    tools=[google_search]
)
```

### Multi-Agent System

```python
from google.adk.agents import LlmAgent

# Specialized agents
researcher = LlmAgent(
    name="Researcher",
    model="gemini-2.5-flash",
    instruction="Research topics thoroughly using web search.",
    tools=[google_search]
)

writer = LlmAgent(
    name="Writer",
    model="gemini-2.5-flash",
    instruction="Write clear, engaging content based on research.",
)

# Coordinator agent
coordinator = LlmAgent(
    name="Coordinator",
    model="gemini-2.5-flash",
    instruction="Delegate tasks to researcher and writer agents.",
    sub_agents=[researcher, writer]
)
```

### Custom Tool Creation

```python
from google.adk.tools import Tool

def calculate_sum(a: int, b: int) -> int:
    """Calculate the sum of two numbers."""
    return a + b

# Convert function to tool
sum_tool = Tool.from_function(calculate_sum)

agent = LlmAgent(
    name="calculator",
    model="gemini-2.5-flash",
    tools=[sum_tool]
)
```

### Sequential Workflow

```python
from google.adk.agents import SequentialAgent

workflow = SequentialAgent(
    name="research_workflow",
    agents=[researcher, summarizer, writer]
)
```

### Parallel Workflow

```python
from google.adk.agents import ParallelAgent

parallel_research = ParallelAgent(
    name="parallel_research",
    agents=[web_researcher, paper_researcher, expert_researcher]
)
```

### Human-in-the-Loop

```python
from google.adk.tools import google_search

# Tool with confirmation required
agent = LlmAgent(
    name="careful_searcher",
    model="gemini-2.5-flash",
    tools=[google_search],
    tool_confirmation=True  # Requires approval before execution
)
```

## Deployment Options

### Cloud Run Deployment

```bash
# Containerize agent
docker build -t my-agent .

# Deploy to Cloud Run
gcloud run deploy my-agent --image my-agent
```

### Vertex AI Agent Engine

```python
# Deploy to Vertex AI for scalable agent hosting
# Integrates with Google Cloud's managed infrastructure
```

### Custom Infrastructure

```python
# Run agents locally or on custom servers
# Full control over deployment environment
```

## Model Support

**Optimized for Gemini**:
- gemini-2.5-flash
- gemini-2.5-pro
- gemini-1.5-flash
- gemini-1.5-pro

**Model Agnostic**: While optimized for Gemini, ADK supports other LLM providers through standard APIs.

## Best Practices

1. **Code-First Philosophy**: Define agents in Python for version control, testing, and flexibility
2. **Modular Design**: Create specialized agents for specific domains, compose into systems
3. **Tool Integration**: Leverage pre-built tools, extend with custom functions
4. **Evaluation**: Test agents systematically against test cases
5. **Safety**: Implement confirmation flows for sensitive operations
6. **Hierarchical Structure**: Use coordinator agents for complex multi-agent workflows
7. **Workflow Selection**: Choose workflow agents for predictable pipelines, LLM agents for dynamic routing

## Common Use Cases

- **Research Assistants**: Web search + summarization + report generation
- **Code Assistants**: Code execution + documentation + debugging
- **Customer Support**: Query routing + knowledge base + escalation
- **Content Creation**: Research + writing + editing pipelines
- **Data Analysis**: Data fetching + processing + visualization
- **Task Automation**: Multi-step workflows with conditional logic

## Development UI

ADK includes built-in interface for:
- Testing agent behavior interactively
- Debugging tool calls and responses
- Evaluating agent performance
- Iterating on agent design

## Resources

- GitHub: https://github.com/google/adk-python
- Documentation: https://google.github.io/adk-docs/
- llms.txt: https://raw.githubusercontent.com/google/adk-python/refs/heads/main/llms.txt

## Implementation Workflow

When implementing ADK-based agents:

1. **Define Requirements**: Identify agent capabilities and tools needed
2. **Choose Architecture**: Single agent, multi-agent, or workflow-based
3. **Select Tools**: Pre-built, custom functions, or OpenAPI integrations
4. **Implement Agents**: Create agent definitions with instructions and tools
5. **Test Locally**: Use development UI for iteration
6. **Add Evaluation**: Create test cases for systematic validation
7. **Deploy**: Choose Cloud Run, Vertex AI, or custom infrastructure
8. **Monitor**: Track agent performance and iterate

Remember: ADK treats agent development like traditional software engineering - use version control, write tests, and follow engineering best practices.
---
