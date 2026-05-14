# Publishing

## Goal

Publish Agent Doctor as a public npm package so users can run:

```bash
npx @carloss765/agent-doctor
```

## Requirements

- npm account with publish access.
- Package name available on npm.
- Clean working tree.
- Passing validation.

## Preflight

```bash
pnpm install
pnpm check
pnpm format:check
pnpm pack:dry-run
npm view agent-doctor
npm view @carloss765/agent-doctor
```

The unscoped `agent-doctor` package name is already occupied on npm. Publish under the scoped package name unless the unscoped name becomes available later.

If `npm view @carloss765/agent-doctor` returns `404`, the scoped package name is available.

## Publish

```bash
npm login
npm publish --access public
```

## Validate Published Package

After publishing:

```bash
npx agent-doctor
npx @carloss765/agent-doctor
npx agent-doctor scan
npx @carloss765/agent-doctor scan
npx agent-doctor init --yes
npx @carloss765/agent-doctor init --yes
npx agent-doctor prescribe --yes
npx @carloss765/agent-doctor prescribe --yes
```

## Safety Notes

- Do not publish with uncommitted changes.
- Do not publish secrets, `.env`, credentials, or local generated files.
- Keep `files` in `package.json` restrictive.
- Run `npm pack --dry-run` before every publish.
