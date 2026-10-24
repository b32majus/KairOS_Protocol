# DIA — Diseñar · Implementar · Auditar

DIA es un protocolo de trabajo **atendido** para tareas pequeñas o medianas en un solo repositorio. Separa el trabajo en tres fases con responsables distintos, de modo que quien implementa no sea quien valida el resultado.

**ODD** (de `gentle-ai`, dentro de Pi) es el motor de la fase Implementar: explora, escribe el test, implementa y verifica. **DIA es el protocolo completo**: además del motor, fija roles, documento de tarea, auditoría y publicación.

## Roles

| Fase | Quién | Responsabilidad |
| --- | --- | --- |
| Diseñar | Claude Code o Cora (ChatGPT), con Sil | Acuerdan el comportamiento esperado y escriben el documento de tarea con la plantilla. |
| Implementar | Pi con `gentle-pi` (ODD), modelos baratos de NaN | Ejecuta el documento de tarea en una rama propia y deja el estado en `ESTADO.md`. |
| Auditar | Claude o Cora, siempre quien **no** implementó | Aplica la lista de auditoría y responde OK o REHACER. |

Que audite alguien que no implementó evita que el mismo criterio valide su propio trabajo.

## Flujo

1. **Documento de tarea.** Se escribe fuera del repo del proyecto si ese repo no permite escribir al diseñador. Por ejemplo: `/srv/kairos-lab/metis-runs/<proyecto>/odd/<tarea>.md`. La plantilla está en `dia/PLANTILLA_TAREA.md`.
2. **Implementación.** `cd <repo>`, `pi`, y pedir `Implementa <ruta del documento>`. Sin interfaz: `pi -p "Implementa <ruta>"`.
3. **ODD.** Explora, test primero, implementa y verifica en una rama y worktree propios, hace commit sin push y deja `<tarea>.ESTADO.md`.
4. **Auditoría.** Se revisa el resultado con la lista de auditoría.
5. **Publicar o mezclar.** Solo con GO de Sil.

## Reglas

- La implementación va en una rama propia creada desde la rama de trabajo del proyecto; nunca directamente sobre ramas protegidas.
- Sin push ni PR sin GO de Sil.
- Se respetan el `AGENTS.md` y las restricciones del proyecto destino.
- Datos sintéticos: no se usan datos reales de personas ni de clientes.

## Lista de auditoría

El resultado es **OK** o **REHACER con el motivo exacto**. Se comprueba:

- cada criterio de aceptación tiene un test que lo comprueba;
- los tests pasan (mirar la cola de la salida, no solo el resumen);
- `git diff --stat` solo toca lo que el alcance permite;
- se revisan 2–3 puntos delicados del diff;
- no hay nada fuera de alcance ni fuera de las restricciones del proyecto;
- `ESTADO.md` coincide con el diff.

Tras **dos REHACER seguidos de la misma tarea**: parar y avisar a Sil. Puede que la tarea necesite Metis o un modelo mejor.

## Modelos

Perfil `nan-reparto` de gentle-pi (2026-10-24):

| Rol | Modelo |
| --- | --- |
| orquestador y worker | `nan/deepseek-v4-flash` (thinking high) |
| fix-agent y judge-a | `nan/glm5.3-flash` |
| explore | `nan/mimo-v2.6-flash` |
| verify | `nan/qwen3.8-flash` |
| judge-b y revisores | `openai-codex/gpt-6-luna` |
| review-risk | `openai-codex/gpt-6.1-sol` |

Cada modelo de NaN tiene cuota mensual propia: deepseek 3B, glm5.3-flash 2B, mimo 1B, qwen3.8-flash 500M; gemma4 y qwen3.6 no tienen límite.

La fuente de verdad es `~/.pi/gentle-ai/models.json`. Se cambia con `/gentle:models` dentro de Pi, no editando los `.md` de agentes.

## GGA

GGA (el revisor de commits de gentle-ai) es **opcional**. Si se usa, su proveedor es `opencode:nan/glm5.3-flash`, nunca Claude.

## Ejemplo

Nexus, autocompletado CIMA en Validación (2026-10-24): `/srv/kairos-lab/metis-runs/nexus/odd/cima-autocomplete.md`.
