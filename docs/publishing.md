# Publishing

This document keeps release steps explicit and reproducible.

## Pre-Release Checklist

Run these checks from the repository root:

```bash
pnpm install
pnpm format:check
pnpm check
pnpm pack:dry-run
```

Before publishing, inspect the dry-run tarball output and confirm it includes:

- `dist/`
- `README.md`
- `AGENTS.md`
- `LICENSE`
- the `agent-ready` binary entry pointing at `dist/cli.js`

## Local Smoke Test

After building, run:

```bash
pnpm build
node dist/cli.js
node dist/cli.js scan
node dist/cli.js scan --json
node dist/cli.js scan --ci --min-score 0
node dist/cli.js init --yes
node dist/cli.js prescribe --yes
```

For a stronger package check, install the packed tarball into a temporary project and run the same
CLI commands there.

## Safety Notes

- Do not publish if `pnpm check` fails.
- Do not publish if `scan --json` prints non-JSON text to stdout.
- Do not publish if `scan --ci --min-score 0` exits non-zero.
- Do not publish if the tarball omits `dist/cli.js` or package metadata.
- Do not include secrets, `.env` files, local reports, or temporary fixtures.
