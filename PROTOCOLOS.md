# Protocolos de trabajo

Este repositorio reúne tres protocolos complementarios para trabajar con agentes de IA sobre código: **DIA**, **Metis** y **Atenea**.

Cada protocolo tiene sus propias reglas, fases, modelos y criterios de cierre. Las reglas de uno **no obligan** a los demás: cada trabajo se ejecuta bajo un protocolo concreto y responde a su documento de referencia.

## Cuándo usar cada uno

| Situación | Protocolo | Dónde están sus reglas |
| --- | --- | --- |
| Tarea pequeña o mediana, atendida (Sil presente), bien entendida, en un solo repo. | **DIA** — Diseñar · Implementar · Auditar | `dia/README.md` |
| Funcionalidad grande o de riesgo, desatendida hasta el PR, con oráculos demostrados. | **Metis** | `metis/README.md` |
| El flujo actual sobre OpenCode V2 + skills de Matt Pocock (C-087). | **Atenea** | `AGENTS.md`, `README.md`, `docs/` |

En la práctica:

- Si la tarea se puede explicar en un documento corto y alguien puede atenderla mientras se ejecuta, es **DIA**.
- Si el trabajo no se puede atender, dura horas o toca áreas de riesgo, es **Metis**.
- Si el trabajo va por OpenCode V2 con los agentes y perfiles de este repo, es **Atenea**.

Un mismo proyecto puede usar los tres a lo largo del tiempo. Lo importante es no mezclar sus reglas dentro de una misma ejecución.

## Fase 2

En una fase posterior el repo podrá renombrarse y Atenea moverse a `atenea/`. Hoy sus rutas no cambian: `AGENTS.md`, `README.md` y `docs/` siguen en la raíz.
