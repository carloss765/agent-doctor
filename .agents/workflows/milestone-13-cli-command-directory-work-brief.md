# Milestone 13: CLI Command Directory

## Goal

Cambiar el comportamiento de `agent-ready` sin argumentos para que muestre un listado simple de comandos y workflow recomendado, en lugar de ejecutar `scan` automáticamente.

## User Value

Los usuarios entienden que Agent Ready es una CLI local, determinística y explícita, no un agente impulsado por IA. Al ejecutar `npx @agent-ready/cli`, ven qué comandos existen y eligen conscientemente qué acción correr.

## Scope

- CLI entrypoint: el comando raíz imprime un command directory/help propio.
- Presentation: agregar o reutilizar un formatter determinístico para listar comandos, opciones comunes y workflow recomendado.
- `scan`, `init` y `prescribe` siguen funcionando igual cuando se invocan explícitamente.
- README: documentar que `npx @agent-ready/cli` muestra comandos disponibles.
- Tests: cubrir el formato del command directory y mantener tests existentes.

## Non-Goals

- No agregar IA, SDKs, APIs externas, servicios hosted ni inferencia automática.
- No agregar un modo interactivo/wizard todavía.
- No agregar nuevos comandos como `design` en este milestone.
- No cambiar la semántica de `scan`, `init` o `prescribe`.
- No agregar dependencias nuevas.

## Acceptance Criteria

- `npx @agent-ready/cli` muestra un listado de comandos disponibles.
- El listado incluye `scan`, `init` y `prescribe` con descripciones breves.
- El listado incluye un workflow recomendado: scan → init → prescribe → scan.
- El listado aclara que Agent Ready no ejecuta modelos de IA y prepara el repo para el coding agent del usuario.
- `npx @agent-ready/cli scan` sigue escaneando el repo sin modificar archivos.
- `npx @agent-ready/cli init` sigue generando starter files seguros sin sobrescribir.
- `npx @agent-ready/cli prescribe` sigue generando la prescription.
- README documenta el nuevo comportamiento del comando raíz.
- `pnpm check` y `pnpm format:check` pasan.

## Owner

Primary role: Developer Agent

## Required Reviewers

- Product Designer Agent: revisar wording y jerarquía del command directory.
- QA Agent: validar que el root command ya no corre scan y que los subcomandos no regresionan.
- Project Manager Agent: confirmar que el cambio mantiene scope local-first y no expande MVP.

## Files Or Areas

- `src/cli.ts`
- `src/cli/formatCommandList.ts` o formatter equivalente
- `tests/cliPresentation.test.ts`
- tests de CLI si existen o nuevo test unitario del formatter
- `README.md`
- `docs/requirements.md` si se ajusta FR-010 o comportamiento raíz

## Validation Plan

- `pnpm format:check`
- `pnpm check`
- Smoke: `node dist/cli.js` muestra command directory después de build.
- Smoke: `node dist/cli.js scan` conserva comportamiento explícito.

## Risks

- Risk: usuarios existentes esperan que `agent-ready` ejecute scan por defecto.
  Mitigation: documentar el cambio y mostrar `agent-ready scan` como primer paso recomendado.
- Risk: duplicar help de Commander de forma inconsistente.
  Mitigation: mantener un formatter pequeño y testeado con las mismas descripciones de comandos.
- Risk: parecer modo interactivo o wizard.
  Mitigation: salida estática, sin prompts, sin escritura de archivos.
