const copyButtons = document.querySelectorAll<HTMLButtonElement>("[data-copy-command]");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const command = button.dataset.copyCommand;

    if (!command) {
      return;
    }

    try {
      await navigator.clipboard.writeText(command);
      button.textContent = "Copied";
      announce("Command copied.");

      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1800);
    } catch {
      announce("Copy failed. Select the command text manually.");
    }
  });
});

function announce(message: string): void {
  const status = document.querySelector<HTMLElement>("#copy-status");

  if (status) {
    status.textContent = message;
  }
}
