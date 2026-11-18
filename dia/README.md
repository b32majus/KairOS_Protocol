# DIA — Diseñar · Implementar · Auditar

DIA es un protocolo de trabajo **atendido** para tareas pequeñas o medianas en un solo repositorio. Separa el trabajo en tres fases con responsables distintos, de modo que quien implementa no sea quien valida el resultado.

La fase Implementar tiene **dos vías**, y las dos son DIA: **Pi con ODD** (`gentle-ai`, dentro de Pi: explora, escribe el test, implementa y verifica) y **OpenCode directo** con un encargo estricto (`dia/OPENCODE.md`). DIA es el protocolo completo: además de la vía, fija roles, documento de tarea, auditoría y publicación.

## Elegir la vía de implementación

La elige el modelo que lidera el proyecto con Sil (Claude o Cora), según la tarea. No es una preferencia fija de Sil ni del proyecto: se decide en cada tarea y se dice en la primera respuesta (`ARRANQUE.md` §5).

| Vía | Cuándo conviene | Qué deja |
| --- | --- | --- |
| **Pi + ODD** (`gentle-pi`) | El comportamiento está acordado pero el test no está escrito, y conviene que el implementador explore, escriba el test y verifique por su cuenta. La tarea tiene archivos o pasos que descubrir. Se quiere una traza en `ESTADO.md`. | Rama, commit sin push y `<tarea>.ESTADO.md`. |
| **OpenCode directo** (`dia/OPENCODE.md`) | Quien diseña puede escribir el test RED o el check que hace de contrato y nombrar las funciones a tocar. Tramos de 1 a 3 funcionalidades, arreglos pequeños, checks de QA de solo lectura. Se busca la vuelta más corta. | Diff en el worktree y una respuesta de ≤12 líneas. |

- Si las dos sirven, se usa la más barata en conjunto: OpenCode directo cuando el contrato ya está escrito; Pi + ODD cuando escribirlo costaría más al diseñador que al implementador.
- Si el trabajo no se puede atender, dura horas o toca áreas de riesgo, no es DIA: es **Metis** (`PROTOCOLOS.md`).

## Roles

| Fase | Quién | Responsabilidad |
| --- | --- | --- |
| Diseñar | Claude Code o Cora (ChatGPT), con Sil | Acuerdan el comportamiento esperado y escriben el documento de tarea (vía Pi) o el test RED y el encargo (vía OpenCode). |
| Implementar | Pi con `gentle-pi` (ODD) u OpenCode directo, con modelos baratos de NaN | Ejecuta el documento o el encargo en una rama y un worktree propios. |
| Auditar | Claude o Cora, siempre quien **no** implementó | Aplica la lista de auditoría y responde OK o REHACER. |

Que audite alguien que no implementó evita que el mismo criterio valide su propio trabajo. El test que hace de contrato tampoco lo audita quien lo escribió: en la vía OpenCode lo escribe quien diseña y el implementador no puede tocarlo; en la vía Pi lo escribe ODD a partir de criterios verificables y lo revisa el auditor.

## Flujo

1. **Situación de partida (obligatorio).** Antes de proponer, estimar el tamaño o preguntar nada a Sil, se investiga lo que impacta: issue y PR, `HANDOFF.md`, decisiones y preguntas abiertas del proyecto, contratos, cómo se hace hoy lo más parecido, y quién escribe y quién lee el dato. Si hay un subagente de exploración barato, se le encarga a él y solo se lee uno mismo lo que decide el diseño. Resultado: 3–6 líneas con fuentes. A Sil solo se le pregunta lo que de verdad no esté decidido, diciendo dónde se buscó.
2. **Documento de tarea o encargo.**
   - Vía Pi: documento de tarea con `dia/PLANTILLA_TAREA.md`, fuera del repo si el diseñador no puede escribir en él. Por ejemplo: `/srv/kairos-lab/metis-runs/<proyecto>/odd/<tarea>.md`.
   - Vía OpenCode: test RED y encargo con la plantilla de `dia/OPENCODE.md`.
   - **Tareas M o sensibles: Sil valida los criterios antes de lanzar** (ver «Tamaño y sensibilidad»). Quien diseña le escribe en 5–10 líneas, sin nada técnico, qué debe pasar y qué no debe pasar, como lo vería un usuario. Sil responde «sí», «falta esto» o «no es así». Se lanza solo con su «sí». Es la única comprobación de que se construye lo correcto: ni el test ni los revisores la sustituyen.
3. **Línea base de checks.** Antes de lanzar, se pasan los checks vecinos sobre el worktree sin tocar. Los que ya fallan se quitan de la lista si fallan por el entorno, o se anotan como «ya fallan antes; no deben empeorar». Así se separan los fallos previos de los que mete el implementador.
4. **Implementación.**
   - Vía Pi: `cd <repo>`, `pi`, y pedir `Implementa <ruta del documento>`. Sin interfaz: `pi -p "Implementa <ruta>"`. ODD explora, escribe el test, implementa y verifica en una rama y worktree propios, hace commit sin push y deja `<tarea>.ESTADO.md`.
   - Vía OpenCode: orden de lanzamiento de `dia/OPENCODE.md`, con el rol de implementador dentro de la propia orden.
5. **Auditoría.** Se revisa el resultado con la lista de auditoría. En tareas M o sensibles incluye el segundo revisor (ver «Segundo revisor»).
6. **Registro de calidad.** Una línea en el registro del proyecto (`ARRANQUE.md` §6).
7. **Publicar o mezclar.** Solo con GO de Sil; vale el GO en bloque de `ARRANQUE.md` §4. Solo se mezcla con CI en verde.

## Tamaño y sensibilidad

- **S**: una funcionalidad o arreglo, ≤3 ficheros de código, sin datos sensibles.
- **M**: el resto de DIA (varias funcionalidades, más ficheros o lógica con estados).
- **Sensible**: toca datos clínicos o personales, permisos o autenticación, migraciones o borrados, pagos o envíos a terceros. Si además es grande o desatendido, va a Metis.
- Se dice el tamaño y si es sensible en la primera respuesta (`ARRANQUE.md` §5). En la duda, se trata como M.

## Segundo revisor (tareas M o sensibles)

Forma parte de **la misma** auditoría, no es una ronda extra: sus hallazgos entran en el único veredicto OK o REHACER.

- **Modelo de otra familia** que el implementador y que el auditor, para que no compartan puntos ciegos:
  - por defecto `openai/gpt-6.2-sol` en OpenCode (suscripción de OpenAI, cuota fija, no gasta créditos de NaN);
  - si el auditor es Cora (también OpenAI), o OpenAI no está disponible: el modelo de NaN que no implementó (`nan/glm5.3-flash` si implementó deepseek, y al revés).
- **Ciego**: recibe los criterios, el encargo o documento de tarea y el diff. Nunca la auditoría ni las conclusiones de quien diseñó.
- **Solo lectura**: no edita ni arregla. Orden de lanzamiento en `dia/OPENCODE.md` §5.
- El auditor comprueba cada hallazgo en el código: los confirmados van al REHACER; los descartados se anotan en una línea con el motivo.

## Reglas

- La implementación va en una rama propia creada desde la rama de trabajo del proyecto; nunca directamente sobre ramas protegidas.
- Sin push ni PR sin GO de Sil (individual o en bloque, `ARRANQUE.md` §4).
- Se respetan el `AGENTS.md`, el `CODING_STANDARDS.md` (si existe) y las restricciones del proyecto destino.
- Datos sintéticos: no se usan datos reales de personas ni de clientes.
- En un worktree con trabajo del implementador nunca se hace `git stash`, `checkout` ni `reset`. Para comparar con HEAD se usa un worktree temporal propio.
- **Guardarraíles ejecutables antes que reglas escritas** (`CODING_STANDARDS.md`, preámbulo y §7). Para llegar a producción, cada proyecto debe tener en CI, bloqueando el merge: lint, comprobación de tipos (si el lenguaje la tiene), su suite de tests y un escaneo de secretos. Si a un proyecto le falta alguno, es una tarea propia, no algo que se arregle de paso.
- Si la auditoría encuentra un fallo que una regla de CI habría detectado, se propone añadir esa regla.

## Lista de auditoría

El resultado es **OK** o **REHACER con el motivo exacto**. Se comprueba:

- si el implementador terminó sin cambios en `git status` (delegó, se creyó coordinador o se cortó): se relanza una vez y, si se repite, se cambia de modelo antes de insistir. No se espera a un worker que no existe;
- cada criterio de aceptación tiene un test que lo comprueba;
- si la tarea cambia algo que ve el usuario, hay además un test de recorrido de principio a fin (abrir, usar y ver el resultado, como haría una persona), no solo tests unitarios: estos pueden pasar con la funcionalidad rota;
- el auditor vuelve a lanzar él mismo los tests y checks; no se fía del informe del implementador. Se mira la cola de la salida, no solo el resumen;
- los fallos que ya estaban en la línea base no cuentan, pero no han empeorado;
- `git diff --stat` solo toca lo que el alcance permite; en la vía OpenCode, ningún test ni check tocado;
- se lee el diff de las funciones tocadas, con su contexto, y se revisan 2–3 puntos delicados;
- no hay lógica añadida solo para pasar un test;
- no hay código duplicado, abstracciones que nadie pidió ni comportamiento fuera de los criterios (son los olores «Duplicated Code» y «Speculative Generality» de `.agents/skills/code-review/SKILL.md`, más el «scope creep» de su eje Spec);
- no hay nada fuera de alcance ni fuera de las restricciones del proyecto;
- `ESTADO.md` (vía Pi) o la respuesta de ≤12 líneas (vía OpenCode) coincide con el diff.

Tras **dos REHACER seguidos de la misma tarea**: parar y avisar a Sil. Puede que la tarea necesite Metis o un modelo mejor.

## Revisión: una vez y basta (obligatorio)

- **Una sola auditoría por entrega**, con veredicto OK o REHACER. Nada de segundas revisiones, revisiones cruzadas ni enmiendas sobre la misma entrega. El segundo revisor de las tareas M o sensibles es parte de esa única auditoría, no una revisión aparte.
- **REHACER** lista solo defectos concretos (archivo y qué falla). Tras el arreglo se comprueban **esos defectos**, no se repite la auditoría entera.
- **No se crean documentos de revisión** (WO, ENMIENDA, REVISION, DICTAMEN, DECISIONES) salvo que Sil los pida. Una decisión de Sil es una línea en el `ESTADO.md` o el `HANDOFF.md`.
- **No se pide a otro agente** que revise algo ya auditado, salvo que Sil lo pida.

## Modelos

### Implementador por defecto: `nan/deepseek-v4-flash`

En todo KairOS el implementador por defecto es `nan/deepseek-v4-flash`, que en NaN sirve DeepSeek V4.1 Flash (1017). Con una orden bien especificada rinde como `glm5.3-flash` y suele costar menos créditos, porque su caché leída cuesta 5 veces menos y es lo que más pesa (la caché leída es 15–25 veces la entrada). Su fallo conocido es despistarse de rol: leer el `AGENTS.md` de un repo con agentes coordinadores, creerse coordinador y no editar nada. Para evitarlo, siempre:

- el rol y la prohibición de delegar van **en la propia orden de lanzamiento** (texto literal en `dia/OPENCODE.md`);
- el encargo sigue la plantilla estricta: qué se puede tocar, qué no (STOP), pasos con nombres exactos, un comando de comprobación, máximo 3 intentos y respuesta de ≤12 líneas;
- si termina sin cambios o se pone a coordinar: se relanza una vez y después se pasa a `nan/glm5.3-flash`.

### Resto de modelos de NaN

| Modelo | Uso |
| --- | --- |
| `nan/glm5.3-flash` | Alternativa para código: ligeramente más fiable (en Nexus nunca delegó y acertó a la primera en tramos de 1 a 3 funcionalidades). Se usa cuando deepseek falla dos veces o el tramo tiene mucha lógica. |
| `nan/mimo-v2.6-flash` | Tareas pequeñas, exploración y documentos mecánicos a partir de un diff y un patrón fijo (descripción de PR, contrato, fila de decisiones). Es el más barato en créditos. |
| `nan/qwen3.8-flash` | También vale para documentos mecánicos y resúmenes, pero cuesta más que mimo y que deepseek. |
| `nan/gemma4` | Pruebas y tareas mínimas. Su precio en créditos está sin verificar. |
| `nan/glm5.3` (full) y `nan/kimi-k3.1-pro` | Unas 10 y 20 veces más caros con los mismos tokens. Decisión de Sil (12-11): no usarlos salvo justificación clara. |
| `nan/qwen3.6` | Antigua. No usar. |

### Coste en créditos

Desde el 12-11, NaN cobra en **créditos**, no en cuota mensual por modelo. El plan de 70 € da 7.000 créditos al mes. Créditos por millón de tokens (fuente: tabla de `cloud.nan.builders/tokens`, 12-11):

| Modelo | Entrada | Caché | Salida |
| --- | --- | --- | --- |
| `deepseek-v4-flash` | 10,5 | 0,21 | 42 |
| `glm5.3-flash` | 5,25 | 1,05 | 17,5 |
| `mimo-v2.6-flash` | 7 | 0,14 | 14 |
| `qwen3.8-flash` | 7,5 | 0,8 | 23,5 |
| `glm5.3` (full) | 49 | 9,1 | 154 |
| `kimi-k3.1-pro` | 100 | 10 | 500 |

- Los precios cambian: si una cifra decide algo, se mira la tabla de NaN ese día.
- Orden de magnitud (tokens medidos en Nexus el 08-11, 19 sesiones): unos 46 créditos el día entero, menos del 1 % del plan; un encargo S cuesta 0,5–1,5 créditos.
- El mayor ahorro no vino del modelo, sino de **quitar la delegación**: sin la frase de rol, los subagentes se llevaban ≈60 % de la entrada y ≈77 % de la caché. Por eso la frase de rol es obligatoria.
- Concurrencia: 7 peticiones simultáneas por modelo y 60 por minuto por clave.
- Ningún encargo ha necesitado visión: los checks afirman con DOM y texto.
- Lo medido viene de Nexus (27-10 a 08-11): muestra pequeña. Detalle en `/srv/kairos-lab/control/nexus/MEDICION_MODELOS_20261108.md`.

### Perfil de la vía Pi

Perfil `nan-reparto` de gentle-pi (2026-10-24):

| Rol | Modelo |
| --- | --- |
| orquestador y worker | `nan/deepseek-v4-flash` (thinking high) |
| fix-agent y judge-a | `nan/glm5.3-flash` |
| explore | `nan/mimo-v2.6-flash` |
| verify | `nan/qwen3.8-flash` |
| judge-b y revisores | `openai-codex/gpt-6-luna` |
| review-risk | `openai-codex/gpt-6.1-sol` |

La fuente de verdad es `~/.pi/gentle-ai/models.json`. Se cambia con `/gentle:profiles` dentro de Pi (desde gentle-pi 4.5; `/gentle:models` ya no existe), no editando los `.md` de agentes.

## GGA

GGA (el revisor de commits de gentle-ai) es **opcional**. Si se usa, su proveedor es `opencode:nan/glm5.3-flash`, nunca Claude.

## Ejemplos

- Vía Pi: Nexus, autocompletado CIMA en Validación (2026-10-24): `/srv/kairos-lab/metis-runs/nexus/odd/cima-autocomplete.md`.
- Vía OpenCode: los ejemplos de encargo están en `dia/OPENCODE.md`.
