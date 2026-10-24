# Arranque de trabajo · KairOS

Prompt de arranque para cualquier agente (Cora, Claude, Pi u otro) que vaya a trabajar en un proyecto de Sil.

## 1. Dónde están las reglas

El repo de protocolos es KairOS_Protocol: `/srv/kairos-lab/KairOS_Protocol` (la ruta antigua `/srv/kairos-lab/Atenea` sigue funcionando como enlace).

Antes de nada, lee `PROTOCOLOS.md` y elige **un** protocolo para este trabajo. No mezcles reglas de dos protocolos en una misma ejecución.

## 2. Los tres protocolos

- **DIA** (`dia/README.md`): trabajo atendido, pequeño o mediano, en un solo repo.
  - *Diseñar*: Cora o Claude redactan con Sil un documento de tarea (`dia/PLANTILLA_TAREA.md`) de una página como máximo, con 5 a 10 criterios.
  - *Implementar*: Pi con ODD y modelos de NaN, en una rama y un worktree propios, dejando un `ESTADO.md`.
  - *Auditar*: quien **no** implementó, con la lista de `dia/README.md`. Veredicto OK o REHACER.
- **Metis** (`metis/README.md`): trabajo grande o de riesgo, desatendido hasta el PR.
  - Versión en uso: `/srv/kairos-lab/qualification/metis-pilot-9.4`.
  - Flujo: `plan-units` → `prep-train` → auditoría de la preparación → `train` → PR_READY → merge humano. Camino corto: `prep` + `run`.
  - Si algo falla, se aplica un arreglo acotado (`prep-check` de una unidad, `train-resume`, `portPolicy`), nunca el protocolo entero: ver «Cuando algo falla» en `metis/README.md`.
- **Atenea** (`atenea/AGENTS.md`, `atenea/README.md`): el flujo de OpenCode V2 con skills (C-087). Sus documentos siguen en `docs/`, `tools/` y `.opencode/`.

## 3. Reglas que valen siempre

- Sin GO explícito de Sil no se hace push, PR, merge ni deploy.
- Las auditorías son de solo lectura. Nunca se lee `reference.patch`.
- Nada de datos reales de pacientes, credenciales ni secretos.
- No mates procesos ni liberes puertos de otros proyectos: repórtalos.
- Antes de afirmar qué hace un sistema, verifícalo en su código o en sus logs.
- Arreglos acotados: un cambio concreto no justifica repetir un protocolo completo.
- Ahorro de tokens: los modelos caros piensan, diseñan y auditan; los baratos implementan y escriben los tests.

## 4. Primera respuesta

Responde en 5 líneas como máximo: proyecto · tarea · protocolo elegido y por qué · primer paso · qué necesitas de Sil.
