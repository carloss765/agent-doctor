const canvas = document.querySelector<HTMLCanvasElement>("#ascii-canvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas) {
  const context = canvas.getContext("2d");

  if (context) {
    const signals = [
      "README.md",
      "AGENTS.md",
      "package.json",
      ".env.example",
      "pnpm-lock.yaml",
      ".agents/skills",
      "test script",
      "lint script",
      "prescription.md"
    ];
    const glyphs = [".", "/", "|", "-", "+", "#", "✓", "!"];
    const cell = 18;
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationId = 0;

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
      context.fillStyle = "rgba(0, 0, 0, 0.08)";
      context.font = "12px SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace";
      context.textBaseline = "top";

      const columns = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          const index = (x * 7 + y * 11 + frame) % glyphs.length;
          const pulse = (x + y + frame) % 19 === 0;
          context.fillStyle = pulse ? "rgba(0, 0, 0, 0.22)" : "rgba(0, 0, 0, 0.07)";
          context.fillText(glyphs[index], x * cell, y * cell);
        }
      }

      drawSignals();
      drawScore();
      frame += prefersReducedMotion ? 0 : 1;

      if (!prefersReducedMotion) {
        animationId = window.requestAnimationFrame(draw);
      }
    }

    function drawSignals(): void {
      signals.forEach((signal, index) => {
        const x = 34 + ((index * 157 + frame * 2) % Math.max(width - 260, 260));
        const y = 88 + index * 44;
        const resolved = (frame + index * 13) % 120 > 28;
        const marker = resolved ? "✓" : "..";

        context.fillStyle = resolved ? "rgba(0, 0, 0, 0.34)" : "rgba(0, 0, 0, 0.16)";
        context.fillText(`${marker} ${signal}`, x, y % Math.max(height - 30, 120));
      });
    }

    function drawScore(): void {
      const rawScore = prefersReducedMotion
        ? 100
        : 72 + Math.floor((Math.sin(frame / 32) + 1) * 14);
      const score = Math.min(rawScore, 100);
      const bar = "█".repeat(Math.round(score / 10)).padEnd(10, "░");

      context.fillStyle = "rgba(0, 0, 0, 0.28)";
      context.fillText(`readiness ${score}/100 ${bar}`, 34, Math.max(height - 78, 120));
    }

    window.addEventListener("resize", () => {
      resize();
      if (prefersReducedMotion) {
        draw();
      }
    });

    resize();
    draw();

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        window.cancelAnimationFrame(animationId);
      });
    }
  }
}
