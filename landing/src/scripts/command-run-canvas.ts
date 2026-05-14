const canvas = document.querySelector<HTMLCanvasElement>("#command-canvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");

if (canvas) {
  const context = canvas.getContext("2d");

  if (context) {
    const asciiRows = [
      " ______     ______     ______     __   __     ______     ______     ______     ______     _____     __  __    ",
      '/\\  __ \\   /\\  ___\\   /\\  ___\\   /\\ "-.\\ \\   /\\__  _\\   /\\  == \\   /\\  ___\\   /\\  __ \\   /\\  __-.  /\\ \\_\\ \\   ',
      "\\ \\  __ \\  \\ \\ \\__ \\  \\ \\  __\\   \\ \\ \\-.  \\  \\/_/\\ \\/   \\ \\  __<   \\ \\  __\\   \\ \\  __ \\  \\ \\ \\/\\ \\ \\ \\____ \\  ",
      ' \\ \\_\\ \\_\\  \\ \\_____\\  \\ \\_____\\  \\ \\_\\\\"\\_\\    \\ \\_\\    \\ \\_\\ \\_\\  \\ \\_____\\  \\ \\_\\ \\_\\  \\ \\____-  \\/\\_____\\ ',
      "  \\/_/\\/_/   \\/_____/   \\/_____/   \\/_/ \\/_/     \\/_/     \\/_/ /_/   \\/_____/   \\/_/\\/_/   \\/____/   \\/_____/"
    ];
    const commandRows = [
      "$ npx @agent-ready/cli scan",
      ".. Scanning repository",
      "✓ README.md found",
      "✓ package.json found",
      "✕ AGENTS.md missing",
      "$ npx @agent-ready/cli init",
      "✓ Created AGENTS.md",
      "✓ Created .env.example",
      "$ npx @agent-ready/cli prescribe",
      "✓ Created prescription.md"
    ];
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationId = 0;

    function ink(alpha: number): string {
      return prefersDarkTheme.matches
        ? `rgba(255, 255, 255, ${alpha})`
        : `rgba(255, 255, 255, ${alpha})`;
    }

    function resize(): void {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(): void {
      context.clearRect(0, 0, width, height);
      context.textBaseline = "top";

      const asciiFontSize = Math.max(5, Math.min(9, (width - 48) / 74));
      context.font = `${asciiFontSize}px SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace`;
      asciiRows.forEach((row, index) => {
        const y = 24 + index * (asciiFontSize + 4);
        context.fillStyle = "rgba(34, 197, 94, 0.72)";
        context.fillText(row, 24, y);
      });

      const commandStartY = 48 + asciiRows.length * (asciiFontSize + 4);
      context.font = "12px SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace";

      commandRows.forEach((row, index) => {
        const reveal = prefersReducedMotion ? row.length : Math.max(0, (frame - index * 14) % 180);
        const text = row.slice(0, Math.min(row.length, reveal));
        const y = commandStartY + index * 28;

        context.fillStyle = row.startsWith("✕") ? "rgba(248, 113, 113, 0.46)" : ink(0.38);
        context.fillText(text, 24, y);
      });

      drawScanLine();
      frame += prefersReducedMotion ? 0 : 1;

      if (!prefersReducedMotion) {
        animationId = window.requestAnimationFrame(draw);
      }
    }

    function drawScanLine(): void {
      const lineWidth = Math.max(0, width - 48);
      const progress = prefersReducedMotion ? lineWidth : (frame * 5) % Math.max(lineWidth, 1);

      context.fillStyle = "rgba(34, 197, 94, 0.72)";
      context.fillRect(24, Math.max(height - 40, 0), progress, 2);
      context.fillStyle = "rgba(255, 255, 255, 0.18)";
      context.fillRect(24 + progress, Math.max(height - 40, 0), lineWidth - progress, 2);
    }

    function handleThemeChange(): void {
      window.cancelAnimationFrame(animationId);
      draw();
    }

    window.addEventListener("resize", () => {
      resize();
      if (prefersReducedMotion) {
        draw();
      }
    });
    prefersDarkTheme.addEventListener("change", handleThemeChange);

    resize();
    draw();

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        window.cancelAnimationFrame(animationId);
        prefersDarkTheme.removeEventListener("change", handleThemeChange);
      });
    }
  }
}
