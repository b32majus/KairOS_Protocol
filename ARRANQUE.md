# Arranque de trabajo · KairOS

Prompt de arranque para cualquier agente (Cora, Claude, Pi u otro) que vaya a trabajar en un proyecto de Sil.

## 1. Dónde están las reglas

El repo de protocolos es KairOS_Protocol: `/srv/kairos-lab/KairOS_Protocol` (la ruta antigua `/srv/kairos-lab/Atenea` sigue funcionando como enlace).

Antes de nada, lee `PROTOCOLOS.md` y elige **un** protocolo para este trabajo. No mezcles reglas de dos protocolos en una misma ejecución.

## 2. Los protocolos (y el cambio directo)

- **Directo** (sin protocolo): para arreglos mínimos que no necesitan ni DIA ni Metis.
  - Vale si cumple todo: cabe en una frase, toca 1–2 archivos, no hay comportamiento que acordar y no toca áreas de riesgo (datos clínicos, permisos, migraciones, pagos, envíos a terceros).
  - Se hace en una rama propia, se pasan los tests del proyecto y se hace commit sin push. Sin documento de tarea ni auditoría: el diff y la salida de los tests bastan para Sil.
  - Si al empezar crece (más archivos, dudas de diseño, tests nuevos de verdad), se para y pasa a DIA.
- **DIA** (`dia/README.md`): trabajo atendido, pequeño o mediano, en un solo repo.
  - *Diseñar*: Cora o Claude redactan con Sil un documento de tarea (`dia/PLANTILLA_TAREA.md`) de una página como máximo, con 5 a 10 criterios.
  - *Implementar*: Pi con ODD y modelos de NaN, en una rama y un worktree propios, dejando un `ESTADO.md`.
  - *Auditar*: quien **no** implementó, con la lista de `dia/README.md`. Veredicto OK o REHACER.
- **Metis** (`metis/README.md`): trabajo grande o de riesgo, desatendido hasta el PR.
  - Versión en uso: `/srv/kairos-lab/qualification/metis-pilot-9.7`. Usa siempre `--prep-dir` en `train` y `train-resume`.
  - Flujo: `plan-units` → `prep-train` → auditoría de la preparación → `train` → PR_READY → merge humano. Camino corto: `prep` + `run`.
  - Si algo falla, se aplica un arreglo acotado (`prep-check` de una unidad, `train-resume`, `--prep-dir`, `portPolicy`, `supersedes`), nunca el protocolo entero: ver «Cuando algo falla» en `metis/README.md`.
- **Atenea** (`atenea/AGENTS.md`, `atenea/README.md`): el flujo de OpenCode V2 con skills (C-087). Sus documentos siguen en `docs/`, `tools/` y `.opencode/`.

## 3. Revisión: una vez y basta (obligatorio)

El cuello de botella no son los tests de Metis, sino las rondas de revisión alrededor. Estas reglas no son opcionales:

- **Una sola auditoría por preparación**, hecha por Cora, con veredicto **OK** o **REHACER**. Nada de segundas revisiones, revisiones cruzadas, enmiendas ni dictámenes sobre la misma preparación.
- **REHACER** lista solo defectos concretos (unidad, archivo, qué falla). Se arreglan por la vía acotada y **decide `prep-check`**, no otra auditoría completa.
- **No se crean documentos de revisión** (WO, ENMIENDA, REVISION, DICTAMEN, DECISIONES) salvo que Sil los pida. Una decisión de Sil es una línea en el `HANDOFF.md` del trabajo.
- **No se pide a Claude ni a otro agente** que revise algo ya auditado, salvo que Sil lo pida.
- **Testigos solo nuevos**: un ticket no lista como testigo tests que ya ejecuta la suite del proyecto (`pnpm test`, `verify:*`). La suite ya corre en el gate.
- Si dudas entre revisar otra vez o lanzar, lanza: el gate, el evaluador y el merge humano siguen ahí.

## 4. Reglas que valen siempre

- Sin GO explícito de Sil no se hace push, PR, merge ni deploy.
- Las auditorías son de solo lectura. Nunca se lee `reference.patch`.
- Nada de datos reales de pacientes, credenciales ni secretos.
- No mates procesos ni liberes puertos de otros proyectos: repórtalos.
- Antes de afirmar qué hace un sistema, verifícalo en su código o en sus logs.
- Arreglos acotados: un cambio concreto no justifica repetir un protocolo completo.
- Ahorro de tokens: los modelos caros piensan, diseñan y auditan; los baratos implementan y escriben los tests.

## 5. Primera respuesta

Responde en 5 líneas como máximo: proyecto · tarea · protocolo elegido y por qué · primer paso · qué necesitas de Sil.

## 6. Al terminar cada implementación

Cuando acabe un trabajo (PR_READY, OK de DIA o una parada), **antes de proponer lo siguiente**, vuelve a leer este archivo, `PROTOCOLOS.md` y el README del protocolo que toque a la siguiente tarea. No respondas de memoria. Después responde en 4 líneas:

1. Protocolo usado y qué quedó cerrado.
2. Siguiente tarea, protocolo que le toca y por qué (según la tabla de `PROTOCOLOS.md`).
3. Si algo falló: qué arreglo acotado aplica, citando la línea de «Cuando algo falla».
4. Qué necesitas de Sil.
