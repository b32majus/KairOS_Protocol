# KairOS_Protocol — protocolos de trabajo

Este repositorio reúne tres protocolos complementarios para trabajar con agentes de IA sobre código: **DIA**, **Metis** y **Atenea**.

Cada protocolo tiene sus propias reglas, fases, modelos y criterios de cierre. Las reglas de uno **no obligan** a los demás: cada trabajo se ejecuta bajo un protocolo concreto y responde a su documento de referencia.

Para arrancar cualquier trabajo, empieza por `ARRANQUE.md`: resume las reglas comunes y cómo elegir protocolo.

## Cuándo usar cada uno

| Situación | Protocolo | Dónde están sus reglas |
| --- | --- | --- |
| Arreglo mínimo y acotado: 1–2 archivos, sin diseño que acordar y fuera de áreas de riesgo. | **Directo** (sin protocolo) | `ARRANQUE.md` §2 |
| Tarea pequeña o mediana, atendida (Sil presente), bien entendida, en un solo repo. | **DIA** — Diseñar · Implementar · Auditar | `dia/README.md` |
| Funcionalidad grande o de riesgo, desatendida hasta el PR, con oráculos demostrados. | **Metis** | `metis/README.md` |
| El flujo actual sobre OpenCode V2 + skills de Matt Pocock (C-087). | **Atenea** | `atenea/AGENTS.md`, `atenea/README.md`; sus documentos siguen en `docs/`, `tools/` y `.opencode/` |

En la práctica:

- Si cabe en una frase, toca 1–2 archivos y no hay nada que decidir (una errata, un texto, un import, un test roto por un cambio evidente), se hace **directo**.
- Si la tarea se puede explicar en un documento corto y alguien puede atenderla mientras se ejecuta, es **DIA**.
- Si el trabajo no se puede atender, dura horas o toca áreas de riesgo, es **Metis**.
- Si el trabajo va por OpenCode V2 con los agentes y perfiles de este repo, es **Atenea**.

Un mismo proyecto puede usar los tres a lo largo del tiempo. Lo importante es no mezclar sus reglas dentro de una misma ejecución.

## Dónde vive cada cosa

- `ARRANQUE.md`: prompt de arranque común para cualquier agente.
- `dia/`: protocolo DIA.
- `metis/`: resumen de Metis; el código está en su propio repo.
- `atenea/`: reglas y README de Atenea. Sus documentos (`docs/`), comprobadores (`tools/`) y agentes (`.opencode/`) siguen en la raíz para no romper las rutas que usan los proyectos y las Coras.
- La ruta antigua `/srv/kairos-lab/Atenea` sigue funcionando como enlace al repo.
