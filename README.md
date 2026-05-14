# Agent Doctor

## Idea general

**Agent Doctor** es una CLI open source que analiza si un proyecto está listo para trabajar con agentes de código como Claude Code, Codex, OpenCode, Cursor, Windsurf u otros.

La herramienta no proporciona un modelo de IA propio. En lugar de eso, funciona como una capa de diagnóstico y preparación del repositorio:

```text
agent-doctor = scanner + generator + prompt builder
user's agent = executor
```

Es decir, Agent Doctor detecta qué tiene y qué le falta al proyecto, genera archivos base y produce instrucciones claras para que el agente del usuario pueda completar las mejoras necesarias.

---

## Problema

Los agentes de código funcionan mejor cuando el repositorio tiene contexto claro, comandos confiables y reglas explícitas. Sin embargo, muchos proyectos nuevos o pequeños no tienen:

* `AGENTS.md`
* README completo
* instrucciones de instalación
* comandos de desarrollo, build, lint o test documentados
* `.env.example`
* reglas de seguridad para agentes
* resumen de arquitectura
* contexto de carpetas principales
* configuración para herramientas como OpenCode o Claude Code

Como resultado, el agente debe adivinar demasiado, puede cometer errores, modificar archivos sensibles o trabajar con poco contexto.

---

## Solución

Agent Doctor revisa el proyecto y responde una pregunta simple:

> ¿Este repositorio está listo para ser trabajado por un agente de código?

Luego entrega:

1. Un diagnóstico del estado actual del proyecto.
2. Una lista clara de lo que falta.
3. Archivos base generados con templates seguros.
4. Prompts específicos para que el agente del usuario implemente las mejoras.

---

## Principio clave

Agent Doctor **no ejecuta IA por sí mismo** en el MVP.

No requiere:

* API keys
* cuenta de OpenAI
* cuenta de Anthropic
* proveedor de modelos
* costos por tokens
* acceso externo al código del usuario

El usuario usa su propio agente, por ejemplo:

* Claude Code
* Codex
* OpenCode
* Cursor
* Windsurf
* cualquier agente que pueda leer archivos del repo

Agent Doctor solo genera el diagnóstico y la “receta” para ese agente.

---

## Comandos propuestos

### Modo interactivo

```bash
npx agent-doctor
```

Escanea el proyecto y muestra un menú interactivo.

Ejemplo:

```text
🩺 Agent Doctor

Scanning your repository...

Project detected:
  Framework: Next.js
  Package manager: pnpm
  Language: TypeScript
  Git: enabled

Agent readiness score: 42/100

Found:
  ✅ README.md
  ✅ package.json
  ✅ dev script: pnpm dev
  ✅ build script: pnpm build

Missing:
  ⚠️ AGENTS.md
  ⚠️ test script
  ⚠️ lint script
  ⚠️ .env.example
  ⚠️ agent safety rules
  ⚠️ architecture context
  ⚠️ OpenCode config
  ⚠️ Claude Code instructions

What would you like to do?

  1. Generate missing base files
  2. Generate only AGENTS.md
  3. Generate OpenCode setup
  4. Generate Claude Code setup
  5. Create a prompt for my agent
  6. Export report only
  7. Exit
```

---

### `scan`

```bash
npx agent-doctor scan
```

Solo revisa el proyecto. No modifica archivos.

Sirve para responder:

> ¿Qué tengo y qué me falta?

Ejemplo:

```text
Agent readiness score: 45/100

✅ README.md found
✅ package.json found
✅ dev script found: pnpm dev
✅ build script found: pnpm build
⚠️ missing AGENTS.md
⚠️ missing .env.example
⚠️ missing test script
⚠️ missing architecture context
⚠️ missing agent safety rules
```

---

### `init`

```bash
npx agent-doctor init
```

Genera archivos base usando templates. No necesita IA.

Posibles archivos generados:

```text
AGENTS.md
.agent-doctor/report.md
.agent-doctor/report.json
.agent-doctor/context.md
.agent-doctor/safety.md
.agent-doctor/prescription.md
```

Opcionalmente, según el agente elegido:

```text
opencode.jsonc
CLAUDE.md
.claude/commands/doctor.md
```

---

### `prescribe`

```bash
npx agent-doctor prescribe
```

Genera una “receta” o prompt para que el agente del usuario implemente lo que falta.

Este comando es más claro que `fix`, porque Agent Doctor no arregla todo directamente. En su lugar, prepara instrucciones para el agente.

Ejemplo:

```text
Prescription created:

.agent-doctor/prescription.md

Give this to your coding agent:

"Read .agent-doctor/prescription.md and apply the recommended repository setup fixes."
```

---

### Alias opcionales

```bash
npx agent-doctor doctor     # alias de scan
npx agent-doctor fix        # alias de prescribe
npx agent-doctor prompt     # alias de prescribe
```

---

## Flujo principal de uso

### 1. Diagnosticar

```bash
npx agent-doctor scan
```

El usuario ve qué tiene y qué le falta al proyecto.

### 2. Inicializar

```bash
npx agent-doctor init
```

Agent Doctor crea archivos base con templates seguros.

### 3. Preparar instrucciones para el agente

```bash
npx agent-doctor prescribe --agent opencode
```

Agent Doctor crea un prompt específico para OpenCode.

### 4. Delegar al agente del usuario

El usuario abre su agente y le dice:

```text
Read .agent-doctor/prescription.opencode.md and apply the recommended fixes.
```

---

## Integraciones por agente

### Universal

Genera instrucciones genéricas que cualquier agente puede leer.

Archivos:

```text
AGENTS.md
.agent-doctor/prescription.md
```

---

### Codex

Codex puede usar `AGENTS.md` como archivo de instrucciones del proyecto.

Comando:

```bash
npx agent-doctor prescribe --agent codex
```

Genera:

```text
AGENTS.md
.agent-doctor/prescription.codex.md
```

---

### Claude Code

Comando:

```bash
npx agent-doctor prescribe --agent claude
```

Genera:

```text
CLAUDE.md
.claude/commands/doctor.md
.agent-doctor/prescription.claude.md
```

La instrucción para el usuario podría ser:

```text
Open Claude Code and run the doctor command, or ask Claude to read .agent-doctor/prescription.claude.md.
```

---

### OpenCode

Comando:

```bash
npx agent-doctor prescribe --agent opencode
```

Genera:

```text
AGENTS.md
opencode.jsonc
.agent-doctor/prescription.opencode.md
```

Posible idea:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "AGENTS.md",
    ".agent-doctor/context.md"
  ],
  "agent": {
    "repo-doctor": {
      "description": "Repairs missing project setup, documentation, safety rules, and agent-readiness files.",
      "prompt": "Read .agent-doctor/prescription.opencode.md and implement the recommended repository readiness fixes."
    }
  }
}
```

---

## Qué debería revisar Agent Doctor

### Project basics

* Existe `README.md`
* Existe `package.json`, `pyproject.toml`, `Cargo.toml`, etc.
* Detecta package manager
* Detecta lenguaje principal
* Detecta framework
* Detecta Git
* Detecta scripts importantes

Ejemplo para proyectos Node.js:

* `dev`
* `build`
* `test`
* `lint`
* `format`

---

### Agent readiness

* Existe `AGENTS.md`
* Existe `CLAUDE.md`, opcional
* Existe `opencode.jsonc`, opcional
* Las instrucciones de setup están claras
* Los comandos están documentados
* Hay reglas para cambios seguros
* Hay contexto del proyecto

---

### Safety

* Hay `.env.example`
* `.env` está protegido en `.gitignore`
* Hay reglas para no modificar secretos
* Hay reglas sobre migraciones de base de datos
* Hay reglas sobre comandos destructivos
* Hay advertencias para autenticación, pagos, permisos y producción

Ejemplo de reglas:

```md
## Safety rules for agents

- Never modify `.env`, `.env.*`, private keys, tokens, or credentials.
- Do not run destructive commands such as `rm -rf`, database resets, or production migrations.
- Ask before changing authentication, payments, permissions, or database schema.
- Prefer small, reviewable changes.
- Summarize every file changed after completing work.
```

---

### Repo context

* Hay resumen de arquitectura
* Las carpetas principales están explicadas
* La capa de datos está identificada
* Las rutas/API están documentadas
* La estrategia de testing está descrita
* Los comandos de validación están claros

---

### DX quality

* Existe `.editorconfig`
* Existe formatter
* Existe linter
* Existe CI
* Existe `.gitignore`
* Existe `CONTRIBUTING.md`, opcional
* Existen templates de issues o PRs, opcional

---

## Archivos generados por el MVP

Primera versión recomendada:

```text
AGENTS.md
.agent-doctor/report.md
.agent-doctor/report.json
.agent-doctor/context.md
.agent-doctor/prescription.md
```

Opcionales:

```text
CLAUDE.md
opencode.jsonc
.claude/commands/doctor.md
```

---

## Ejemplo de `AGENTS.md` generado

```md
# AGENTS.md

## Project overview

This project appears to be a Node.js/TypeScript project.

## Commands

- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: not detected
- Lint: not detected

## Project structure

- `src/`: main application source code
- `public/`: static assets, if present
- `tests/`: test files, if present

## Agent rules

- Do not edit `.env` or credential files.
- Do not change business logic unless explicitly requested.
- Prefer small, reviewable changes.
- Run available validation commands after making changes.
- Summarize every file changed.
```

---

## Ejemplo de prescription generada

```md
# Agent Doctor Prescription

You are working inside this repository.

Read these files first:

- `.agent-doctor/report.md`
- `package.json`
- `README.md`
- `AGENTS.md` if it exists

The repository is missing:

- AGENTS.md
- .env.example
- test script
- architecture summary
- agent safety rules

Your task:

1. Create or improve `AGENTS.md`.
2. Add a basic `.env.example` if environment variables are referenced.
3. Add missing setup instructions to `README.md`.
4. Create `.agent-doctor/context.md` explaining the project structure.
5. Add safety rules for AI coding agents.
6. Do not modify application business logic.
7. Do not add dependencies unless necessary.
8. Run available validation commands after changes.

When finished, summarize:

- files changed
- what was added
- commands run
- remaining issues
```

---

## MVP recomendado

### v0.1

Enfocarse solo en proyectos Node.js/TypeScript.

Checks:

* `README.md`
* `package.json`
* package manager
* scripts `dev`, `build`, `test`, `lint`
* `AGENTS.md`
* `.env.example`
* `.gitignore`
* estructura básica del proyecto

Comandos:

```bash
npx agent-doctor
npx agent-doctor scan
npx agent-doctor init
npx agent-doctor prescribe
```

Generadores:

* `AGENTS.md`
* `.agent-doctor/report.md`
* `.agent-doctor/report.json`
* `.agent-doctor/context.md`
* `.agent-doctor/prescription.md`

---

## Roadmap

### v0.1

* Scanner para Node.js
* Detección de npm, pnpm, yarn y bun
* Detección de scripts
* Generador de `AGENTS.md`
* Generador de reportes
* Generador de prescription universal

### v0.2

* Adaptador para OpenCode
* Generador de `opencode.jsonc`
* Prescription específica para OpenCode
* Agente `repo-doctor` configurable en OpenCode

### v0.3

* Adaptador para Claude Code
* Generador de `CLAUDE.md`
* Generador de `.claude/commands/doctor.md`
* Prescription específica para Claude Code

### v0.4

* Soporte para Python
* Soporte para Rust
* Soporte para Go
* Detección de CI
* Detección de estrategia de testing

### v0.5

* Modo interactivo avanzado
* Score badges
* GitHub Action
* Reporte JSON estable para CI

---

## Posible stack técnico

Recomendación inicial: TypeScript.

Dependencias posibles:

```text
TypeScript
Node.js
pnpm
commander o cac
picocolors
zod
fast-glob
execa
prompts
```

Estructura sugerida:

```text
src/
  cli.ts
  scanners/
    node.ts
    git.ts
    readme.ts
    env.ts
    agents.ts
    ci.ts
  generators/
    agents-md.ts
    opencode.ts
    claude.ts
    report.ts
    prescription.ts
  adapters/
    codex.ts
    opencode.ts
    claude.ts
  rules/
    index.ts
  types.ts
```

---

## Diferencial

Agent Doctor no es un linter de código.

Es un linter de contexto para agentes.

Su promesa:

> Your AI coding agent is only as good as your repo context. Agent Doctor finds what your repo forgot to tell it.

---

## Frase corta del proyecto

```text
Agent Doctor helps new projects become safe, understandable, and ready for AI coding agents.
```

---

## README pitch

```md
# Agent Doctor

Agent Doctor is a CLI that diagnoses and prepares your repository for AI coding agents.

It scans your project, detects missing setup and context files, generates safe starter templates, and creates precise prompts for your own coding agent.

Agent Doctor does not provide an AI model.
It works with the agent you already use: Claude Code, Codex, OpenCode, Cursor, Windsurf, or any agent that can read files in your repository.
```

---

## Visión

Agent Doctor puede convertirse en una herramienta estándar para proyectos nuevos:

```bash
mkdir my-app
cd my-app
npm init -y
npx agent-doctor init
```

Así como muchos proyectos tienen linters, formatters y checkers de salud, Agent Doctor busca convertirse en el checker de preparación para agentes de código.

---

## Estado de implementación

El proyecto ya incluye un scaffold inicial de CLI en TypeScript y el comando read-only `scan`.

Comandos de desarrollo:

```bash
pnpm install
pnpm dev
pnpm dev -- scan
pnpm build
pnpm test
pnpm lint
pnpm format:check
pnpm check
```

El comando `scan` revisa señales iniciales del repositorio sin crear, modificar ni eliminar archivos.

Estado actual:

- Milestone 1: scaffold CLI, scripts, tests, build y CI.
- Milestone 2: scanner estructurado con archivos base, Git, lockfile y scripts Node.
- Milestone 3: analyzer con readiness score, status y next steps.
- Milestone 4: comando `init` para crear `AGENTS.md` y `.env.example` faltantes sin sobrescribir archivos existentes.
- Milestone 5: presentación CLI con color opcional y salida compacta para `scan`.
- Milestone 6: comando `prescribe` para generar `.agent-doctor/prescription.md` sin sobrescribir.

Uso local:

```bash
pnpm dev          # default: scan read-only
pnpm dev -- scan
pnpm dev -- init --yes
pnpm dev -- prescribe --yes
```
