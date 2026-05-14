<p align="center">
  <img src="./landing/public/favicon.svg" alt="Agent Ready favicon" width="72" height="72" />
</p>

<h1 align="center">AGENT READY</h1>

<p align="center">
  Diagnose whether a repository is ready for AI coding agents.
</p>

<p align="center">
  <a href="https://github.com/carloss765/agent-ready">Repository</a>
  ·
  <a href="./docs/technical-decisions.md">Technical decisions</a>
  ·
  <a href="./docs/publishing.md">Publishing</a>
</p>

---

## What It Is

Agent Ready is an open source Node.js CLI that checks whether a project has the context,
commands, safety files, and setup signals that coding agents need before they start changing code.

It does not provide an AI model and does not call any hosted AI service. It prepares your repository
for the agent you already use, such as Codex, Claude Code, OpenCode, Cursor, Windsurf, or another
tool that can read files in your project.

```text
agent-ready = scanner + generator + prescription builder
your coding agent = executor
```

## Why Use It

Coding agents work better when a repository tells them what matters. Many projects are missing that
context:

- `AGENTS.md` with project-specific instructions
- documented `dev`, `build`, `test`, `lint`, and `format` commands
- `.env.example` with safe placeholders
- clear safety rules for secrets and destructive commands
- a simple readiness summary before delegating work

Agent Ready finds those gaps and gives you a concrete next step instead of making your coding agent
guess.

## What It Checks

The current version focuses on Node.js and TypeScript projects. It scans for:

- repository basics: Git, manifests, package manager, lockfile
- context files: `README.md`, `AGENTS.md`, `.env.example`
- scripts: `dev`, `build`, `test`, `lint`, `format`
- agent tooling signals: Codex, Claude Code, OpenCode, Cursor, Windsurf
- local skills under `.agents/skills`
- readiness score, status, and recommended next steps

## Install

Run it directly with `npx`:

```bash
npx agent-ready scan
```

The public package uses the unscoped npm name `agent-ready`.

For local development:

```bash
pnpm install
pnpm build
pnpm dev -- scan
```

## Commands

### `scan`

Scans the repository without modifying files.

```bash
npx agent-ready scan
```

Useful when you want to know what the repo already has and what is missing.

You can scan another directory with `--root`:

```bash
npx agent-ready scan --root ./path/to/project
```

### `init`

Creates safe starter files without overwriting existing files.

```bash
npx agent-ready init
```

Currently generated files:

- `AGENTS.md`
- `.env.example`

If either file already exists, Agent Ready skips it.

### `prescribe`

Creates a prescription file for your coding agent.

```bash
npx agent-ready prescribe
```

Generated file:

- `.agent-ready/prescription.md`

Give that file to your coding agent and ask it to apply the recommended repository setup fixes.

## Suggested Workflow

1. Diagnose the project:

```bash
npx agent-ready scan
```

2. Generate missing base files:

```bash
npx agent-ready init
```

3. Create instructions for your coding agent:

```bash
npx agent-ready prescribe
```

4. Ask your agent to read the prescription:

```text
Read .agent-ready/prescription.md and apply the recommended repository setup fixes.
Do not modify secrets or run destructive commands.
```

5. Re-scan after changes:

```bash
npx agent-ready scan
```

## Commands To Test The Tool

From this repository:

```bash
pnpm install
pnpm dev -- scan
pnpm dev -- init --yes
pnpm dev -- prescribe --yes
pnpm test
pnpm build
pnpm lint
pnpm check
```

After building, you can test the compiled CLI:

```bash
pnpm build
node dist/cli.js scan
node dist/cli.js init --yes
node dist/cli.js prescribe --yes
```

To test against a temporary project:

```bash
mkdir /tmp/agent-ready-demo
cd /tmp/agent-ready-demo
pnpm init
node /path/to/agent-ready/dist/cli.js scan
node /path/to/agent-ready/dist/cli.js init --yes
node /path/to/agent-ready/dist/cli.js prescribe --yes
```

Replace `/path/to/agent-ready` with the absolute path to this repository.

## Development

Main commands:

```bash
pnpm dev          # default scan
pnpm dev -- scan
pnpm dev -- init --yes
pnpm dev -- prescribe --yes
pnpm test
pnpm lint
pnpm build
pnpm check
pnpm format
```

Landing page:

```bash
pnpm --dir landing dev
pnpm --dir landing build
pnpm --dir landing preview
```

## Project Structure

```text
src/
  analyzer/      readiness scoring and next steps
  cli/           command output, parsing, presentation helpers
  generator/     AGENTS.md, .env.example, and prescription generation
  scanner/       repository inspection
tests/           Vitest coverage
docs/            technical and publishing notes
landing/         Astro landing page
.agents/         project agent roles, messages, and workflows
```

## Safety Model

Agent Ready is intentionally conservative:

- `scan` is read-only.
- `init` does not overwrite existing files.
- `prescribe` does not overwrite an existing prescription.
- no API keys are required.
- no model provider account is required.
- generated instructions warn agents not to modify secrets or run destructive commands.

## Current Status

Implemented:

- TypeScript CLI scaffold
- `scan`, `init`, and `prescribe` commands
- readiness analyzer and score
- Node.js project signal detection
- package manager and script detection
- agent tool and skill detection
- Vitest test suite
- Astro landing page

Planned:

- richer framework detection
- stable JSON report output
- CI-friendly mode
- adapter-specific prescriptions for Codex, Claude Code, and OpenCode
- broader language support beyond Node.js

## License

MIT. See [LICENSE](./LICENSE).
