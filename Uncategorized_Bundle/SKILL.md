---
name: uncategorized-bundle
description: Uncategorized skills for Manus AI
---

## Uncategorized Skills Bundle

### Skill: claude-code


# Claude Code

Anthropic's agentic coding tool combining autonomous planning, execution, and validation with extensibility through skills, plugins, MCP servers, and hooks.

## Core Concepts

**Subagents**: Specialized agents (planner, content-reviewer, campaign-debugger, docs-manager, ui-ux-designer, researcher, copywriter)

**Agent Skills**: Modular capabilities with SKILL.md + bundled resources (scripts, references, assets) loaded progressively

**Slash Commands**: User-defined operations in `.opencode/commands/` expanding to prompts

**Hooks**: Event-driven shell commands (SessionStart, PreToolUse, PostToolUse, Stop, SubagentStop)

**MCP Servers**: Model Context Protocol integrations for external tools (GitHub, Jira, databases)

**Plugins**: Packaged collections distributed via marketplace

## Reference Guide

Load references as needed for specific topics:

| Topic | Reference File | Contents |
|-------|----------------|----------|
| Installation & setup | `references/getting-started.md` | Prerequisites, installation methods, authentication |
| Slash commands | `references/slash-commands.md` | Full catalog: /cook, /plan, /fix, /test, /docs, /git, /design |
| Workflow examples | `references/common-workflows.md` | Feature implementation, bug fixing, testing, git ops |
| Creating skills | `references/agent-skills.md` | Skill structure, metadata, bundled resources |
| MCP servers | `references/mcp-integration.md` | Configuration, common servers, authentication |
| Hooks system | `references/hooks-comprehensive.md` | Event types, command/prompt hooks, tool matchers |
| Plugins | `references/hooks-and-plugins.md` | Plugin structure, marketplace, installation |
| Configuration | `references/configuration.md` | Settings hierarchy, model config, output styles |
| Enterprise | `references/enterprise-features.md` | SSO, RBAC, sandboxing, audit logging, deployment |
| IDE integration | `references/ide-integration.md` | VS Code extension, JetBrains plugin |
| CI/CD | `references/cicd-integration.md` | GitHub Actions, GitLab workflows |
| Advanced features | `references/advanced-features.md` | Extended thinking, caching, checkpointing |
| Troubleshooting | `references/troubleshooting.md` | Auth failures, MCP issues, performance, debug mode |
| API reference | `references/api-reference.md` | Admin, Messages, Files, Models, Skills APIs |
| Best practices | `references/best-practices.md` | Project organization, security, performance, cost |

## Instructions

When answering questions:

1. Identify topic from user query
2. Load relevant reference files (use table above)
3. Provide specific guidance with examples
4. For complex queries, load multiple references

**Documentation sources:**
- Context7 llms.txt: `https://context7.com/websites/claude_en_claude-code/llms.txt?tokens=10000`
- Topic search: `https://context7.com/websites/claude_en_claude-code/llms.txt?topic=<topic>&tokens=5000`
- Official docs: https://docs.claude.com/en/docs/claude-code/
- GitHub: https://github.com/anthropics/claude-code
- Support: support.claude.com

---
### Skill: docs


## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `init` | 💡💡💡💡 Analyze the codebase and create initial documentation | `references/init.md` |
| `llms` | 💡💡💡 Generate llms.txt based on the current codebase | `references/llms.md` |
| `summarize` | 💡 Analyze the codebase and update documentation | `references/summarize.md` |
| `update` | 💡💡💡 Analyze the codebase and update documentation | `references/update.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
---
### Skill: kit-builder


# Kit Builder

Build skills, agents, commands, and workflows for ClaudeKit Marketing.

## When to Use

- Creating new skill for specialized task
- Adding new agent for marketing automation
- Building command for user workflow
- Designing workflow for process orchestration
- Understanding kit component structure

## Component Types

| Type | Location | Purpose |
|------|----------|---------|
| Skill | `.opencode/skills/{name}/SKILL.md` | Domain knowledge + tools |
| Agent | `.opencode/agents/{name}.md` | Specialized subagent |
| Command | `.opencode/commands/{path}.md` | User-invocable action |
| Workflow | `.opencode/workflows/{name}.md` | Process orchestration |

## Quick Start

**Create skill:** Load `references/skill-guide.md`
**Create agent:** Load `references/agent-guide.md`
**Create command:** Load `references/command-guide.md`
**Create workflow:** Load `references/workflow-guide.md`

## Init Script

```bash
python .opencode/skills/kit-builder/scripts/init_component.py <type> <name>
```

Types: `skill`, `agent`, `command`, `workflow`

## Decision Tree

```
What to build?
├── Reusable domain knowledge → Skill
│   └── API, tool, workflow patterns
├── Autonomous task handler → Agent
│   └── Orchestrates skills + tools
├── User-triggered action → Command
│   └── Slash command (/name)
└── Process definition → Workflow
    └── Multi-step orchestration
```

## References

| Guide | File |
|-------|------|
| Skill Creation | `references/skill-guide.md` |
| Agent Creation | `references/agent-guide.md` |
| Command Creation | `references/command-guide.md` |
| Workflow Creation | `references/workflow-guide.md` |
| Best Practices | `references/best-practices.md` |
| Marketing Checklist | `references/marketing-checklist.md` |

## Templates

| Template | Path |
|----------|------|
| Skill | `templates/skill-template.md` |
| Agent | `templates/agent-template.md` |
| Command | `templates/command-template.md` |
| Workflow | `templates/workflow-template.md` |

## Integration

**Related:** skill-creator, claude-code

**Agents:** planner, researcher, docs-manager

---
### Skill: web-design-guidelines


# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Fetch the latest guidelines from the source URL below
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.

---
