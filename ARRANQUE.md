# Arranque de trabajo · KairOS

Prompt de arranque para cualquier agente (Cora, Claude, Pi u otro) que vaya a trabajar en un proyecto de Sil.

## 1. Dónde están las reglas

El repo de protocolos es KairOS_Protocol: `/srv/kairos-lab/KairOS_Protocol` (la ruta antigua `/srv/kairos-lab/Atenea` sigue funcionando como enlace).

Antes de nada, lee `PROTOCOLOS.md` y elige **un** protocolo para este trabajo. No mezcles reglas de dos protocolos en una misma ejecución.

## 2. Los protocolos (y el cambio directo)

- **Directo** (sin protocolo): para arreglos mínimos que no necesitan ni DIA ni Metis.
  - Vale si cumple todo: cabe en una frase, toca 1–2 archivos, no hay comportamiento que acordar y no toca áreas de riesgo (datos clínicos, permisos, migraciones, pagos, envíos a terceros).
  - Se hace en una rama propia, se pasan los tests del proyecto y se hace commit sin push. Sin documento de tarea ni auditoría: el diff y la salida de los tests bastan para Sil.
  - Antes de crear una función, componente o estilo, se busca en el repo si ya existe uno que sirva y se usa ese. Si se crea uno nuevo, la línea del registro de calidad dice qué se buscó.
  - Si cambia algo que ve el usuario, debe haber un test (existente o nuevo de pocas líneas) que lo cubra. Si no lo hay y no cabe en pocas líneas, es DIA.
  - Si al empezar crece (más archivos, dudas de diseño, tests nuevos de verdad), se para y pasa a DIA.
  - Contra el abuso: cada directo se anota en el registro de calidad (§6), y en la duda entre directo y DIA, es DIA.
- **DIA** (`dia/README.md`): trabajo atendido, pequeño o mediano, en un solo repo.
  - *Diseñar*: Cora o Claude redactan con Sil un documento de tarea (`dia/PLANTILLA_TAREA.md`) de una página como máximo, con 5 a 10 criterios.
  - *Implementar*: con modelos de OpenCode Go, en una rama y un worktree propios, por una de dos vías: Pi con ODD (deja un `ESTADO.md`) u OpenCode directo con un encargo estricto (`dia/OPENCODE.md`). La vía la elige el modelo que lidera el proyecto con Sil, según la tarea (`dia/README.md`, «Elegir la vía»).
  - *Auditar*: quien **no** implementó, con la lista de `dia/README.md`. Veredicto OK o REHACER.
- **Metis** (`metis/README.md`): trabajo grande o de riesgo, desatendido hasta el PR.
  - Se elige la vía al empezar: si una unidad no merece una referencia privada, tampoco merece Metis y va por DIA.
  - Unidades verticales: cada una lleva dominio, pantalla y test de recorrido juntos, no microreglas sueltas.
  - Versión en uso: `/srv/kairos-lab/qualification/metis-pilot-9.9`. Usa siempre `--prep-dir` en `train` y `train-resume`.
  - Flujo: `plan-units` → `prep-train` → auditoría de la preparación → `train` → PR_READY → merge humano. Camino corto: `prep` + `run`.
  - Si algo falla, se aplica un arreglo acotado (`prep-check` de una unidad, `train-resume`, `--prep-dir`, `portPolicy`, `supersedes`), nunca el protocolo entero: ver «Cuando algo falla» en `metis/README.md`.
- **Atenea** (`atenea/AGENTS.md`, `atenea/README.md`): el flujo de OpenCode V2 con skills (C-087). Sus documentos siguen en `docs/`, `tools/` y `.opencode/`.

## 3. Revisión: una vez y basta (obligatorio)

El cuello de botella no son los tests de Metis, sino las rondas de revisión alrededor. Estas reglas no son opcionales:

- **Una sola auditoría por preparación**, hecha por Cora, con veredicto **OK** o **REHACER**. Nada de segundas revisiones, revisiones cruzadas, enmiendas ni dictámenes sobre la misma preparación.
- **REHACER** lista solo defectos concretos (unidad, archivo, qué falla). Se arreglan por la vía acotada y **decide `prep-check`**, no otra auditoría completa.
- **No se crean documentos de revisión** (WO, ENMIENDA, REVISION, DICTAMEN, DECISIONES) salvo que Sil los pida. Una decisión de Sil es una línea en el `HANDOFF.md` del trabajo.
- **No se pide a Claude ni a otro agente** que revise algo ya auditado, salvo que Sil lo pida. Excepción fija: en DIA, el segundo revisor de las tareas M o sensibles forma parte de la única auditoría (`dia/README.md`, «Segundo revisor»).
- **Testigos solo nuevos**: un ticket no lista como testigo tests que ya ejecuta la suite del proyecto (`pnpm test`, `verify:*`). La suite ya corre en el gate.
- Si dudas entre revisar otra vez o lanzar, lanza: el gate, el evaluador y el merge humano siguen ahí.

## 4. Reglas que valen siempre

- Sin GO explícito de Sil no se hace push, PR, merge ni deploy.
  - **GO en bloque:** un GO de Sil a una propuesta concreta cubre, para ese trabajo, el push de su rama, el PR, los checks necesarios y el merge si CI está en verde y no hay conflictos.
  - Siguen necesitando un GO propio: deploy, borrar ramas o worktrees, tags, releases, force-push, cambiar la rama por defecto y tocar el checkout de Sil.
  - Las ramas protegidas y las restricciones de cada proyecto siguen mandando. En Metis, el GO en bloque solo cubre el merge si se da después de PR_READY.
- Las auditorías son de solo lectura. Nunca se lee `reference.patch`.
- Nada de datos reales de pacientes, credenciales ni secretos.
- No mates procesos ni liberes puertos de otros proyectos: repórtalos.
- Dentro de herdr (VPS): lanzar implementadores en paneles visibles, hablar con otras sesiones y sus reglas en `HERDR.md`.
- Antes de afirmar qué hace un sistema, verifícalo en su código o en sus logs.
- Arreglos acotados: un cambio concreto no justifica repetir un protocolo completo.
- Ahorro de tokens: los modelos caros piensan, diseñan y auditan; los baratos implementan. El test que hace de contrato lo escribe quien diseña (vía OpenCode) u ODD a partir de criterios verificables (vía Pi), y nunca lo audita quien lo escribió. Los baratos sí escriben bien checks de QA de solo lectura y documentos mecánicos.

## 5. Primera respuesta

Si el trabajo continúa uno anterior, antes de responder lee el bloque «EMPEZAR AQUÍ» del `HANDOFF.md` y contrástalo con GitHub y el repo: `gh pr list`, `gh issue list`, `git worktree list` y el `git log` del worktree citado. Lo que diga GitHub manda sobre el HANDOFF.

Responde en 5 líneas como máximo: proyecto · tarea · protocolo elegido (y vía, tamaño S/M y si es sensible, si es DIA) y por qué · primer paso · qué necesitas de Sil.

## 6. Al terminar cada implementación

Cuando acabe un trabajo (PR_READY, OK de DIA o una parada), **antes de proponer lo siguiente**, vuelve a leer este archivo, `PROTOCOLOS.md` y el README del protocolo que toque a la siguiente tarea. No respondas de memoria. Después responde en 4 líneas:

1. Protocolo usado y qué quedó cerrado.
2. Siguiente tarea, protocolo que le toca y por qué (según la tabla de `PROTOCOLOS.md`).
3. Si algo falló: qué arreglo acotado aplica, citando la línea de «Cuando algo falla».
4. Qué necesitas de Sil.

Y deja el estado para la siguiente sesión: reescribe el bloque «EMPEZAR AQUÍ» del `HANDOFF.md` (≤25 líneas: estado, decisiones, próximo paso) y mueve lo viejo a `HANDOFF_HISTORICO_<fecha>.md`. Un tramo es una sesión.

### Registro de calidad

Cada proyecto tiene un `CALIDAD.md` junto a su `HANDOFF.md`. Al cerrar cada trabajo (también los directos) se añade una línea:

`fecha · tarea · protocolo/vía · S/M/sensible · modelo · nº de REHACER · hallazgos confirmados del segundo revisor · enlace a la PR`

Y cuando aparezca después un fallo en algo ya mezclado, o se revierta: `fecha · ESCAPADO o REVERT · qué falló · tarea de origen · qué lo habría detectado`.

Una vez al mes, quien lidera el proyecto lo resume a Sil en 3 líneas: fallos escapados, reverts y si algún tipo de tarea o modelo da más problemas. Si los escapados suben, se endurece el protocolo de ese tipo de tarea (pasar de S a M, añadir una regla de CI). En ese mismo resumen se propone quitar las reglas y checks que no han detectado nada en los últimos meses: si no, solo crecen.

## 7. Prompt de apertura

Lo que Sil pega al abrir una sesión de proyecto:

```
Vas a trabajar siguiendo el protocolo KairOS (GitHub Kairós Protocol).

1. Lee primero, en este orden y sin responder de memoria:
   - /srv/kairos-lab/KairOS_Protocol/ARRANQUE.md
   - /srv/kairos-lab/KairOS_Protocol/PROTOCOLOS.md
   - el README del protocolo que elijas (dia/README.md, dia/OPENCODE.md o metis/README.md)
   - si estás dentro de herdr (HERDR_ENV=1): /srv/kairos-lab/KairOS_Protocol/HERDR.md
2. Si este trabajo continúa uno anterior, lee el bloque «EMPEZAR AQUÍ» de <ruta del HANDOFF.md> y contrástalo con GitHub y el repo (gh pr list, gh issue list, git worktree list, git log). Lo que diga GitHub manda sobre el HANDOFF.
3. Tarea: <una o dos frases>.
4. Restricciones propias de este proyecto: <p. ej. ramas que no se tocan, datos, áreas de riesgo>. Aquí cuenta como sensible: <p. ej. datos clínicos, permisos, migraciones, borrados>.
5. Responde en 5 líneas como máximo: proyecto · tarea · protocolo (y vía, tamaño S/M y si es sensible, si es DIA) y por qué · primer paso · qué necesitas de Sil.

Sin GO explícito de Sil no hagas push, PR, merge ni deploy (un GO a una propuesta concreta vale en bloque, ARRANQUE §4). Cuando termines, haz lo que dice ARRANQUE §6: reescribe «EMPEZAR AQUÍ» en el HANDOFF y añade la línea en CALIDAD.md.
```
