# Metis

Metis es un **arnés ligero para trabajo desatendido**: un orquestador determinista, un writer, un gate determinista y un evaluador. El orquestador no improvisa: ejecuta fases definidas y deja evidencia en disco.

- Código y documentación técnica: `/srv/kairos-lab/qualification/metis-c091-20261019`.
- Versión congelada en uso: `/srv/kairos-lab/qualification/metis-pilot-9.1` (`node .../bin/metis.mjs`).

## Flujo largo (una funcionalidad, varias unidades)

1. **Issue aprobado**, redactado con Cora.
2. **`plan-units`**: se parte el issue en unidades y se aprueba el plan.
3. **`prep-train`**: por unidad, el autor escribe el ticket, el oráculo y una referencia privada. Metis comprueba que el oráculo **falla en BASE** y **pasa 3/3 con la referencia**.
4. **Auditoría de la preparación por Cora**: aprobación antes de gastar writer.
5. **`train`**: el writer barato implementa; el gate y el evaluador deciden; hay correcciones acotadas.
6. **PR_READY** y **merge humano**.

La comprobación del paso 3 es la que da valor al conjunto: si el oráculo no falla en BASE, no mide nada; si no pasa con la referencia, la unidad no está bien preparada.

## Camino corto (un solo ticket)

Para un único ticket bien delimitado: **`prep` + `run`**. Se prepara el ticket y su oráculo, se comprueba contra la referencia y se ejecuta la unidad sin pasar por `plan-units`.

## Modelos

Los modelos se declaran por rol en el `--repo-config`:

```text
models.author
models.planner
models.reviewer
models.writerVolume
models.writerComplex
models.evaluator
```

Cada rol puede apuntar a un modelo distinto; el writer barato es el que más volumen consume.

## Cuándo no usar Metis

Tareas pequeñas o atendidas → **DIA** (`dia/README.md`). Metis tiene sentido cuando el trabajo no se puede atender, dura horas o toca áreas de riesgo y merece oráculos demostrados antes de escribir código.

## Regla de auditoría

**Nunca leer `reference.patch` en auditorías.** La referencia privada existe para demostrar que el oráculo discrimina, no para guiar la revisión: si el auditor la lee, deja de evaluar el resultado con criterios independientes.
