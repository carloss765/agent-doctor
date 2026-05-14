export function parseRootOption(args: string[], fallbackRoot: string): string {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--root" || arg === "-r") {
      return args[index + 1] ?? fallbackRoot;
    }

    if (arg.startsWith("--root=")) {
      return arg.slice("--root=".length);
    }
  }

  return fallbackRoot;
}
