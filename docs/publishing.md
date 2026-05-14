# Publishing

## Goal

Publish Agent Ready as a public npm package so users can run:

```bash
npx agent-ready
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
npm view agent-ready
```

The unscoped `agent-ready` package name must return `404` before the first publish. If it returns
package metadata, stop and choose another name.

## Publish

```bash
npm login
npm publish --access public
```

## Validate Published Package

After publishing:

```bash
npx agent-ready
npx agent-ready scan
npx agent-ready init --yes
npx agent-ready prescribe --yes
```

## Safety Notes

- Do not publish with uncommitted changes.
- Do not publish secrets, `.env`, credentials, or local generated files.
- Keep `files` in `package.json` restrictive.
- Run `npm pack --dry-run` before every publish.
