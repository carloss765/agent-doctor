export type PresentationOptions = {
  color?: boolean;
};

const reset = "\u001b[0m";
const cyan = "\u001b[36m";
const green = "\u001b[32m";
const yellow = "\u001b[33m";
const dim = "\u001b[2m";
const bold = "\u001b[1m";

export function shouldUseColor(): boolean {
  return Boolean(process.stdout.isTTY) && process.env.NO_COLOR === undefined;
}

export function renderHeader(options: PresentationOptions = {}): string[] {
  const color = options.color ?? false;
  const logo = ["  ___                    _     ___          _             ", " / _ \\  __ _  ___ _ __ | |_  /   \\___  ___| |_ ___  _ __ ", "/ /_)/ / _` |/ _ \\ '_ \\| __|/ /\\ / _ \\/ __| __/ _ \\| '__|", "/ ___/ | (_| |  __/ | | | |_/ /_// (_) \\__ \\ || (_) | |   ", "\\/      \\__, |\\___|_| |_|\\__/___,' \\___/|___/\\__\\___/|_|   ", "        |___/                                             "];

  return [
    ...logo.map((line) => paint(line, cyan, color)),
    paint("Agent Doctor", bold, color),
    paint("Repository readiness for coding agents.", dim, color)
  ];
}

export function heading(value: string, options: PresentationOptions = {}): string {
  return paint(value, bold, options.color ?? false);
}

export function success(value: string, options: PresentationOptions = {}): string {
  return paint(value, green, options.color ?? false);
}

export function warning(value: string, options: PresentationOptions = {}): string {
  return paint(value, yellow, options.color ?? false);
}

function paint(value: string, code: string, enabled: boolean): string {
  return enabled ? `${code}${value}${reset}` : value;
}
