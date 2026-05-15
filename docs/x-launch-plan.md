# X Launch Plan

## Audience

Developers using coding agents such as Codex, Claude Code, Cursor, OpenCode, Windsurf, or similar
tools on real repositories.

## Positioning

Agent Ready is a quick local readiness check for repositories before delegating work to coding
agents. It finds missing context, commands, safety files, and agent-tooling signals, then helps
generate starter instructions and a prescription for the agent the developer already uses.

## Core Message

Coding agents do better work when the repository tells them how to work. Agent Ready checks whether
that context exists before the agent starts changing code.

## Primary X Post

```text
Your coding agent should not have to guess how your repo works.

Agent Ready checks the basics locally:

npx @agent-ready/cli scan

Find missing AGENTS.md, .env.example, scripts, package manager signals, and agent setup.

No API keys. Open source.
```

## Alternate Post

```text
I built Agent Ready: a local CLI that checks if your repo is ready for coding agents.

npx @agent-ready/cli scan

It detects missing context, scripts, safety files, and agent setup signals before you delegate work.

No API keys. Open source. Works with the agent you already use.
```

Use the primary post for a standard 280-character post. Use the alternate only as a longer post or
as the first two posts in a thread.

## Thread

### 1

```text
Coding agents do not only fail because of the model.

They also fail when the repo gives them no map:

- no AGENTS.md
- unclear scripts
- missing .env.example
- no safety rules
- no verification path
```

### 2

```text
Agent Ready is a CLI for checking those gaps:

npx @agent-ready/cli scan

It scores the repo and shows what is ready, missing, or unclear before an agent starts editing code.
```

### 3

```text
It is local-first.

No API keys.
No hosted AI calls.
No code upload.

Agent Ready is not the agent. It prepares the repo for Codex, Claude Code, Cursor, OpenCode,
Windsurf, or whatever coding agent you already use.
```

### 4

```text
When setup files are missing, run:

npx @agent-ready/cli init

It creates safe starter files like AGENTS.md and .env.example without overwriting existing files.
```

### 5

```text
Then generate a brief for the next agent run:

npx @agent-ready/cli prescribe

That writes .agent-ready/prescription.md with what to read, what is missing, and what to improve
next.

Try it:
npx @agent-ready/cli scan
```

## Demo Asset

Create a 20-30 second terminal GIF or video.

Show this flow:

1. Start in a small sample repo with missing agent context.
2. Run `npx @agent-ready/cli scan`.
3. Show readiness score, missing `AGENTS.md`, missing `.env.example`, and missing scripts.
4. Run `npx @agent-ready/cli init`.
5. Show created `AGENTS.md` and `.env.example`.
6. Run `npx @agent-ready/cli prescribe`.
7. Open `.agent-ready/prescription.md` briefly and show the agent refinement task.

The visual should prove the before/after:

- Before: the repo gives agents little context.
- After: the repo has starter instructions and a clear next-agent brief.

## Screenshot Checklist

- Terminal with `npx @agent-ready/cli scan`.
- Readiness score and status.
- Missing/found sections.
- `init` output showing created files.
- `prescribe` output showing `.agent-ready/prescription.md`.

## CTA

```text
Try it in your repo:

npx @agent-ready/cli scan
```

## Claims To Avoid

- Do not say Agent Ready fixes the repo automatically.
- Do not say it uses AI.
- Do not say it improves model quality.
- Do not say it supports every stack deeply.
- Do not imply files are overwritten.
- Do not imply code leaves the user's machine.
