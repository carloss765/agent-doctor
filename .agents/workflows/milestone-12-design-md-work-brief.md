# Milestone 12: DESIGN.md Init And Scan

## Goal

Agregar soporte local-first para `DESIGN.md` como señal de contexto de producto/diseño: `init` debe crear un starter seguro con un prompt para que el agente del usuario lo complete según el contexto implementado, y `scan` debe detectar si el repositorio ya cuenta con `DESIGN.md`.

## User Value

Los usuarios podrán separar instrucciones operativas para agentes (`AGENTS.md`) de contexto de producto/diseño (`DESIGN.md`). Esto ayuda a que un coding agent entienda intención, flujos, restricciones UX y decisiones de diseño antes de cambiar código, sin que Agent Ready ejecute IA ni suba contenido a servicios externos.

## Scope

- Scanner: detectar `DESIGN.md` en la raíz del repositorio y reportarlo en señales `found`/`missing` sin modificar archivos.
- Analyzer: decidir el peso de `DESIGN.md` en readiness manteniendo score total en `100`; recomendación PM: agregarlo como señal de contexto con peso moderado y reequilibrar puntos sin degradar excesivamente repos existentes.
- Init generator: generar `DESIGN.md` cuando falte, usando `writeIfMissing` y contenido determinístico basado solo en `ScanResult`.
- Starter `DESIGN.md`: incluir prompt claro para que el agente del usuario lo complete leyendo README, docs, source y UI existente; debe pedir describir objetivos, usuarios, flujos, decisiones UX, estados, restricciones y preguntas abiertas.
- CLI output: mostrar `DESIGN.md` dentro de Found/Missing y reflejar created/skipped en `init`.
- Docs: actualizar README y requirements para documentar que `scan` evalúa `DESIGN.md` e `init` puede crearlo.
- Tests: cubrir scanner, analyzer si cambia scoring, init generation/idempotencia/no overwrite, y presentación CLI si hay expectativas específicas.

## Non-Goals

- No ejecutar modelos de IA, SDKs de IA, APIs externas ni inferencia automática de diseño.
- No crear archivos fuera de la raíz salvo los ya existentes en el flujo actual; `DESIGN.md` debe vivir en la raíz.
- No sobreescribir `DESIGN.md` existente.
- No cambiar el contrato de `scan` read-only.
- No implementar editor interactivo, wizard ni preguntas dinámicas en este milestone.
- No generar diseños visuales, wireframes, imágenes ni assets.
- No agregar dependencias nuevas salvo aprobación explícita.

## Acceptance Criteria

- `agent-ready scan` detecta `DESIGN.md` en la raíz y lo lista como found cuando existe.
- `agent-ready scan` lista `DESIGN.md` como missing cuando no existe.
- `scan` no crea, edita ni elimina archivos; esto queda cubierto por test read-only.
- `agent-ready init` crea `DESIGN.md` si falta, junto con los demás starter files aplicables.
- `agent-ready init` omite `DESIGN.md` si ya existe y conserva exactamente su contenido.
- El contenido generado de `DESIGN.md` es determinístico, no incluye secretos, no afirma hechos no detectados y explica que debe ser refinado por el agente del usuario con base en el repositorio real.
- El prompt de `DESIGN.md` instruye al agente externo a leer documentación/source antes de completar objetivos, usuarios, flujos, estados, restricciones, decisiones y preguntas abiertas.
- La salida de `init` muestra `DESIGN.md` en Created o Skipped según corresponda.
- README documenta `DESIGN.md` en What It Checks, init generated files, workflow/safety si aplica.
- Requirements reflejan la nueva señal/generación sin contradecir local-first, no SDKs de IA y no overwrite.
- Tests automatizados relevantes pasan con `pnpm test`; build/lint/check se ejecutan si el cambio toca tipos, CLI docs o salida pública.

## Owner

Primary role: Developer Agent

## Required Reviewers

- Product Designer Agent: revisar estructura, lenguaje y utilidad del template `DESIGN.md` y del prompt de refinamiento.
- QA Agent: validar read-only de `scan`, no-overwrite de `init`, determinismo y regresiones de scoring/output.
- Project Manager Agent: confirmar scope, criterios de aceptación y que no se expande el MVP.
- DevOps Engineer Agent: solo si el cambio afecta CI, build, package distribution o scripts; no requerido para una implementación normal.

## Suggested Milestone Order

1. Product Designer: definir secciones finales del template `DESIGN.md` y wording del prompt de refinamiento.
2. Developer: actualizar scanner/types para incluir `DESIGN.md` en señales base.
3. Developer + PM: ajustar analyzer/scoring si se decide que `DESIGN.md` suma puntos; mantener total 100 y documentar el rebalance.
4. Developer: actualizar `initProject` para planificar y renderizar `DESIGN.md` con `writeIfMissing`.
5. Developer: actualizar CLI presentation solo si requiere wording adicional; Found/Missing y Created/Skipped deberían cubrirlo automáticamente.
6. Developer/Docs: actualizar README y docs/requirements.md.
7. QA: agregar/actualizar tests y ejecutar validación completa.
8. PM: revisión final de aceptación y handoff.

## Files Or Areas

- `src/scanner/types.ts`
- `src/scanner/scanRepository.ts`
- `src/analyzer/analyzeReadiness.ts`
- `src/generator/initProject.ts`
- `src/cli/formatScanResult.ts` si se necesita copy adicional
- `src/cli/formatInitResult.ts` si se ajustan next steps
- `tests/scanner.test.ts`
- `tests/analyzer.test.ts`
- `tests/initProject.test.ts`
- `tests/cliPresentation.test.ts` si cambia output formateado
- `README.md`
- `docs/requirements.md`

## Validation Plan

- `pnpm test`
- `pnpm lint`
- `pnpm build`
- `pnpm check`
- Smoke local: `pnpm dev -- scan` confirma `DESIGN.md` en Found/Missing sin cambios de filesystem.
- Smoke local en repo temporal: `pnpm dev -- init --yes` confirma creación de `DESIGN.md` y segunda corrida confirma skipped/no overwrite.

## Risks

- Risk: diluir el readiness score o romper expectativas de 100 puntos.
  Mitigation: acordar rebalance explícito, cubrir analyzer tests y documentar cambio como comportamiento público.
- Risk: `DESIGN.md` generado parezca output de IA o afirme contexto no detectado.
  Mitigation: mantener template como prompt/starter, usar solo señales locales y etiquetar valores desconocidos como `not detected`.
- Risk: romper garantía de `scan` read-only.
  Mitigation: no escribir desde scanner/analyzer/formatter y ampliar test de no modificación.
- Risk: sobreescribir diseño existente del usuario.
  Mitigation: usar `writeIfMissing`; testear preservación exacta.
- Risk: confundir roles entre `AGENTS.md` y `DESIGN.md`.
  Mitigation: `AGENTS.md` conserva reglas operativas; `DESIGN.md` enfoca producto, UX, flujos, restricciones y decisiones.
- Risk: scope creep hacia generación automática de features/diseño.
  Mitigation: limitar este milestone a starter + detección; propuestas futuras deben salir como follow-up después de re-scan.
