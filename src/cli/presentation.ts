export type PresentationOptions = {
  color?: boolean;
};

type ProgressOptions = PresentationOptions & {
  intervalMs?: number;
  stream?: NodeJS.WriteStream;
};

const reset = "\u001b[0m";
const cyan = "\u001b[36m";
const green = "\u001b[32m";
const yellow = "\u001b[33m";
const dim = "\u001b[2m";
const bold = "\u001b[1m";
const red = "\u001b[31m";
const magenta = "\u001b[35m";
const clearLine = "\u001b[2K";

const spinnerFrames = ["   ", ".  ", ".. ", "..."];

export function shouldUseColor(): boolean {
  return Boolean(process.stdout.isTTY) && process.env.NO_COLOR === undefined;
}

export function renderHeader(options: PresentationOptions = {}): string[] {
  const color = options.color ?? false;
  const logo = [
    "  ___                    _     ___          _             ",
    " / _ \\  __ _  ___ _ __ | |_  /   \\___  ___| |_ ___  _ __ ",
    "/ /_)/ / _` |/ _ \\ '_ \\| __|/ /\\ / _ \\/ __| __/ _ \\| '__|",
    "/ ___/ | (_| |  __/ | | | |_/ /_// (_) \\__ \\ || (_) | |   ",
    "\\/      \\__, |\\___|_| |_|\\__/___,' \\___/|___/\\__\\___/|_|   ",
    "        |___/                                             "
  ];

  return [
    ...logo.map((line) => paint(line, cyan, color)),
    paint("Agent Doctor", bold, color),
    paint("Repository readiness for coding agents.", dim, color)
  ];
}

export function renderTitle(options: PresentationOptions = {}): string {
  return paint("Agent Doctor", bold, options.color ?? false);
}

export function heading(value: string, options: PresentationOptions = {}): string {
  return paint(value, magenta, options.color ?? false);
}

export function label(value: string, options: PresentationOptions = {}): string {
  return paint(value, bold, options.color ?? false);
}

export function success(value: string, options: PresentationOptions = {}): string {
  return paint(value, green, options.color ?? false);
}

export function warning(value: string, options: PresentationOptions = {}): string {
  return paint(value, yellow, options.color ?? false);
}

export function danger(value: string, options: PresentationOptions = {}): string {
  return paint(value, red, options.color ?? false);
}

export function muted(value: string, options: PresentationOptions = {}): string {
  return paint(value, dim, options.color ?? false);
}

export function brand(value: string, options: PresentationOptions = {}): string {
  return paint(value, cyan, options.color ?? false);
}

export function progress(value: string, options: PresentationOptions = {}): string {
  return `${brand("..", options)} ${value}`;
}

export function successItem(value: string, options: PresentationOptions = {}): string {
  return `  ${success("✓", options)} ${value}`;
}

export function missingItem(value: string, options: PresentationOptions = {}): string {
  return `  ${warning("-", options)} ${value}`;
}

export function skippedItem(value: string, options: PresentationOptions = {}): string {
  return `  ${muted("-", options)} ${value}`;
}

export function toolItem(
  name: string,
  details: string,
  detected: boolean,
  options: PresentationOptions = {}
): string {
  const status = detected ? success("ready", options) : warning("missing", options);
  const suffix = details.length > 0 ? muted(` ${details}`, options) : "";

  return `  ${detected ? success("✓", options) : warning("-", options)} ${name}: ${status}${suffix}`;
}

export function scoreBar(score: number, options: PresentationOptions = {}): string {
  const total = 10;
  const filled = Math.round((Math.max(0, Math.min(score, 100)) / 100) * total);
  const empty = total - filled;
  const bar = `${"█".repeat(filled)}${"░".repeat(empty)}`;

  if (score >= 85) {
    return success(bar, options);
  }

  if (score >= 55) {
    return warning(bar, options);
  }

  return danger(bar, options);
}

export async function withProgress<T>(
  message: string,
  task: () => Promise<T>,
  options: ProgressOptions = {}
): Promise<T> {
  const stream = options.stream ?? process.stderr;
  const color = options.color ?? false;

  if (!stream.isTTY) {
    stream.write(`${progress(message, { color })}\n`);
    return task();
  }

  let frameIndex = 0;
  stream.write(renderProgressFrame(message, spinnerFrames[frameIndex], { color }));

  const timer = setInterval(() => {
    frameIndex = (frameIndex + 1) % spinnerFrames.length;
    stream.write(`\r${renderProgressFrame(message, spinnerFrames[frameIndex], { color })}`);
  }, options.intervalMs ?? 120);

  try {
    const result = await task();
    clearInterval(timer);
    stream.write(`${clearLine}\r${success("✓", { color })} ${message}\n`);
    return result;
  } catch (error) {
    clearInterval(timer);
    stream.write(`${clearLine}\r${danger("!", { color })} ${message}\n`);
    throw error;
  }
}

function paint(value: string, code: string, enabled: boolean): string {
  return enabled ? `${code}${value}${reset}` : value;
}

function renderProgressFrame(
  message: string,
  frame: string,
  options: PresentationOptions = {}
): string {
  return `${brand(frame, options)} ${message}`;
}
