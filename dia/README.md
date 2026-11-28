# DIA — Diseñar · Implementar · Auditar

DIA es un protocolo de trabajo **atendido** para tareas pequeñas o medianas en un solo repositorio. Separa el trabajo en tres fases con responsables distintos, de modo que quien implementa no sea quien valida el resultado.

La fase Implementar tiene **dos vías**, y las dos son DIA: **Pi con ODD** (`gentle-ai`, dentro de Pi: explora, escribe el test, implementa y verifica) y **OpenCode directo** con un encargo estricto (`dia/OPENCODE.md`). DIA es el protocolo completo: además de la vía, fija roles, documento de tarea, auditoría y publicación.

## Cómo lo usamos por defecto

- El modelo fuerte diseña y audita; un modelo barato implementa. Lo normal es la vía OpenCode directo con el contrato ya escrito; Pi + ODD se usa cuando el implementador tiene que descubrir archivos o escribir el test.
- ODD no es todo DIA: es solo lo que hace `gentle-ai` dentro de la vía Pi (explorar, escribir el test, implementar y verificar).
- Un arreglo pequeño y claro no necesita el protocolo entero: se hace directamente. DIA es para tramos medianos o con riesgo, y lo grande o desatendido va a Metis.
- Exploración: un modelo barato busca y el fuerte lee solo lo que decide el diseño y comprueba por sí mismo los puntos que deciden.
- Suscripciones (25-11): todo lo barato va por **OpenCode Go** (`opencode-go/...`); los modelos de OpenAI van por la suscripción de ChatGPT, desde OpenCode (`openai/...`) o Pi (`openai-codex/...`). Ambas están iniciadas en OpenCode, Pi y Hermes. NaN ya no existe.

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
| Implementar | Pi con `gentle-pi` (ODD) u OpenCode directo, con modelos baratos de OpenCode Go | Ejecuta el documento o el encargo en una rama y un worktree propios. |
| Auditar | Claude o Cora, siempre quien **no** implementó | Aplica la lista de auditoría y responde OK o REHACER. |

Que audite alguien que no implementó evita que el mismo criterio valide su propio trabajo. El test que hace de contrato tampoco lo audita quien lo escribió: en la vía OpenCode lo escribe quien diseña y el implementador no puede tocarlo; en la vía Pi lo escribe ODD a partir de criterios verificables y lo revisa el auditor.

## Flujo

1. **Situación de partida (obligatorio).** Antes de proponer, estimar el tamaño o preguntar nada a Sil, se investiga lo que impacta: issue y PR, `HANDOFF.md`, decisiones y preguntas abiertas del proyecto, contratos, cómo se hace hoy lo más parecido, y quién escribe y quién lee el dato. Si hay un subagente de exploración barato, se le encarga a él y solo se lee uno mismo lo que decide el diseño. Resultado: 3–6 líneas con fuentes. A Sil solo se le pregunta lo que de verdad no esté decidido, diciendo dónde se buscó.
2. **Documento de tarea o encargo.**
   - Vía Pi: documento de tarea con `dia/PLANTILLA_TAREA.md`, fuera del repo si el diseñador no puede escribir en él. Por ejemplo: `/srv/kairos-lab/proyectos/<proyecto>/metis/odd/<tarea>.md`.
   - Vía OpenCode: test RED y encargo con la plantilla de `dia/OPENCODE.md`.
   - **Tareas M o sensibles: Sil valida los criterios antes de lanzar** (ver «Tamaño y sensibilidad»). Quien diseña le escribe en 5–10 líneas, sin nada técnico, qué debe pasar y qué no debe pasar, como lo vería un usuario. Sil responde «sí», «falta esto» o «no es así». Se lanza solo con su «sí». Es la única comprobación de que se construye lo correcto: ni el test ni los revisores la sustituyen.
3. **Línea base de checks.** Antes de lanzar, se pasan los checks vecinos sobre el worktree sin tocar. Los que ya fallan se quitan de la lista si fallan por el entorno, o se anotan como «ya fallan antes; no deben empeorar». Así se separan los fallos previos de los que mete el implementador.
4. **Implementación.**
   - Vía Pi: `cd <repo>`, `pi`, y pedir `Implementa <ruta del documento>`. Sin interfaz: `pi -p "Implementa <ruta>"`. ODD explora, escribe el test, implementa y verifica en una rama y worktree propios, hace commit sin push y deja `<tarea>.ESTADO.md`.
   - Vía OpenCode: orden de lanzamiento de `dia/OPENCODE.md`, con el rol de implementador dentro de la propia orden.
5. **Auditoría.** Se revisa el resultado con la lista de auditoría. En tareas M o sensibles incluye el segundo revisor (ver «Segundo revisor»).
6. **Registro de calidad.** Una línea en el registro del proyecto (`ARRANQUE.md` §6).
7. **Publicar o mezclar.** Solo con GO de Sil; vale el GO en bloque de `ARRANQUE.md` §4. Solo se mezcla con CI en verde.
8. **Limpiar.** Con el PR fusionado, quien cerró el tramo borra su worktree (`git worktree remove`, sin `--force`) y los temporales de comparación, antes de empezar otro tramo. Si no se puede (cambios sin guardar, alguien dentro), lo dice en el HANDOFF. Comprobación: `/srv/kairos-lab/herramientas/limpiar-worktrees --repo <repo>`.

## Tamaño y sensibilidad

- **S**: una funcionalidad o arreglo, ≤3 ficheros de código, sin datos sensibles.
- **M**: el resto de DIA (varias funcionalidades, más ficheros o lógica con estados).
- **Sensible**: toca datos clínicos o personales, permisos o autenticación, migraciones o borrados, pagos o envíos a terceros. Si además es grande o desatendido, va a Metis.
- Se dice el tamaño y si es sensible en la primera respuesta (`ARRANQUE.md` §5). En la duda, se trata como M.

## Quién revisa según el tamaño (norma de Sil, 25-11)

| Tarea | Revisión |
| --- | --- |
| Pequeña (S) | Una auditoría, con `openai/gpt-6-luna` y razonamiento alto. |
| Mediana (M) | El auditor fuerte más un segundo revisor `openai/gpt-6.2-sol`. |
| Sensible o de riesgo (datos clínicos o personales, permisos, borrados, pagos) | `openai/gpt-6.2-sol` como segundo revisor y, además, el ataque descrito más abajo. |

Luna hace el grueso de las revisiones porque gasta menos cuota de ChatGPT; Sol se reserva para lo que pide el mejor juicio. Es una regla de reparto, no una medición: si en un tramo mediano se revisa a ciegas con los dos, se anota qué encontró cada uno para ajustarla.

## Segundo revisor (tareas M o sensibles)

Forma parte de **la misma** auditoría, no es una ronda extra: sus hallazgos entran en el único veredicto OK o REHACER.

- **Modelo de otra familia** que el implementador y que el auditor, para que no compartan puntos ciegos:
  - por defecto `openai/gpt-6.2-sol` en OpenCode (suscripción de OpenAI, cuota fija);
  - si el auditor es Cora (también OpenAI), o OpenAI no está disponible: el modelo de OpenCode Go que no implementó (`opencode-go/glm-5.3-flash` si implementó deepseek, y al revés).
- **Ciego**: recibe los criterios, el encargo o documento de tarea y el diff. Nunca la auditoría ni las conclusiones de quien diseñó.
- **Solo lectura**: no edita ni arregla. Orden de lanzamiento en `dia/OPENCODE.md` §5.
- El auditor comprueba cada hallazgo en el código: los confirmados van al REHACER; los descartados se anotan en una línea con el motivo.
- **En tareas sensibles, además ataca.** El mismo segundo revisor (no uno más) recibe la orden de intentar romper lo que el diff toca, como lo haría alguien con malas intenciones. Revisar el diff no basta: un fallo de permisos o una clave a la vista pueden estar en código que el diff no muestra. Lo que intenta, según lo que exista en el proyecto:
  - entrar sin sesión, o con la sesión de un usuario pedir los datos de otro;
  - probar contraseñas o códigos sin límite;
  - saltarse una regla de negocio por otra vía (otra pantalla, otra llamada, otro orden de pasos) en vez de por el botón que la oculta;
  - meter datos raros en cada entrada: texto muy largo, HTML o `<script>`, caracteres especiales, números en el límite;
  - buscar claves, contraseñas o datos reales en el código, en lo que se publica y en lo que ve el navegador.
  Solo en local, con datos sintéticos y sin editar nada. Orden en `dia/OPENCODE.md` §5.

## Reglas

- La implementación va en una rama propia creada desde la rama de trabajo del proyecto; nunca directamente sobre ramas protegidas.
- Sin push ni PR sin GO de Sil (individual o en bloque, `ARRANQUE.md` §4).
- Se respetan el `AGENTS.md`, el `CODING_STANDARDS.md` del repo (si no tiene, el común de KairOS_Protocol) y las restricciones del proyecto destino.
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
- lo nuevo no existía ya: por cada función, componente o estilo nuevo del diff, se busca en el repo (`grep` del nombre, de la clase CSS o de lo que hace) si había uno que servía. El diff solo no lo muestra. Si había uno, es REHACER salvo que el encargo explique por qué no se usa;
- no hay nada fuera de alcance ni fuera de las restricciones del proyecto;
- `ESTADO.md` (vía Pi) o la respuesta de ≤12 líneas (vía OpenCode) coincide con el diff.

Tras **dos REHACER seguidos de la misma tarea**: parar y avisar a Sil. Puede que la tarea necesite Metis o un modelo mejor.

## Revisión: una vez y basta (obligatorio)

- **Una sola auditoría por entrega**, con veredicto OK o REHACER. Nada de segundas revisiones, revisiones cruzadas ni enmiendas sobre la misma entrega. El segundo revisor de las tareas M o sensibles es parte de esa única auditoría, no una revisión aparte.
- **REHACER** lista solo defectos concretos (archivo y qué falla). Tras el arreglo se comprueban **esos defectos**, no se repite la auditoría entera.
- **No se crean documentos de revisión** (WO, ENMIENDA, REVISION, DICTAMEN, DECISIONES) salvo que Sil los pida. Una decisión de Sil es una línea en el `ESTADO.md` o el `HANDOFF.md`.
- **No se pide a otro agente** que revise algo ya auditado, salvo que Sil lo pida.
- **Veredicto medible**: el auditor deja en `ESTADO.md` (o en la respuesta de ≤12 líneas de la vía OpenCode) la línea `Inicio · Cierre · Veredicto: OK|REHACER · Vueltas: N`, para poder contar vueltas y tiempos después.

## Modelos

### Implementador por defecto: `opencode-go/deepseek-v4.1-flash`

Desde el 20-11 los modelos baratos se usan por **OpenCode Go** (proveedor `opencode-go`), que sustituye a NaN (cancelado). Los modelos de OpenAI van aparte, por la suscripción de ChatGPT.

En todo KairOS el implementador por defecto es `opencode-go/deepseek-v4.1-flash` (DeepSeek V4.1 Flash). Con una orden bien especificada rinde como `glm-5.3-flash`. Su fallo conocido es despistarse de rol: leer el `AGENTS.md` de un repo con agentes coordinadores, creerse coordinador y no editar nada. Para evitarlo, siempre:

- el rol y la prohibición de delegar van **en la propia orden de lanzamiento** (texto literal en `dia/OPENCODE.md`);
- el encargo sigue la plantilla estricta: qué se puede tocar, qué no (STOP), pasos con nombres exactos, un comando de comprobación, máximo 3 intentos y respuesta de ≤12 líneas;
- si termina sin cambios o se pone a coordinar: se relanza una vez y después se pasa a `opencode-go/glm-5.3-flash`.

### Resto de modelos de OpenCode Go

| Modelo | Uso |
| --- | --- |
| `opencode-go/glm-5.3-flash` | Alternativa para código: ligeramente más fiable (en Nexus nunca delegó y acertó a la primera en tramos de 1 a 3 funcionalidades). Se usa cuando deepseek falla dos veces o el tramo tiene mucha lógica. |
| `opencode-go/deepseek-v4.1-flash` | También para explorar (lectura y búsqueda con el rol de solo lectura en la orden) y para documentos mecánicos a partir de un diff y un patrón fijo (descripción de PR, contrato, fila de decisiones). Es el modelo con más margen del plan (unas 43.000 peticiones cada 5 h, 100 $ al mes), y si explora y luego implementa se reutiliza la caché. |
| `opencode-go/glm-5.3` (full) | Tramos complejos, **a probar** (25-11). En OpenCode Go tiene un tope de 200 $ al mes y unas 2.600 peticiones cada 5 h, así que la regla del 12-11 (basada en los precios de NaN) ya no aplica. Medir en un tramo real antes de adoptarlo. |
| Fuera de uso (25-11) | `mimo-v2.6-flash` y `qwen3.8-flash` (decisión de Sil: no aportan sobre DeepSeek y GLM), `qwen3.6`, `kimi-k3.1-pro` (588 peticiones cada 5 h, poco margen para volumen) y `muse-spark-*-contributor` (obligan a permitir entrenar con las peticiones). |

### Coste

- El consumo y los límites de OpenCode Go están **sin medir** en KairOS. Las cifras de créditos de NaN (12-11) no valen para OpenCode Go; si una cifra decide algo, se mira la página de uso de OpenCode Go ese día.
- El mayor ahorro no vino del modelo, sino de **quitar la delegación**: sin la frase de rol, los subagentes se llevaban ≈60 % de la entrada y ≈77 % de la caché. Por eso la frase de rol es obligatoria.
- Ningún encargo ha necesitado visión: los checks afirman con DOM y texto.
- Lo medido viene de Nexus (27-10 a 08-11, con NaN): muestra pequeña. Detalle en `/srv/kairos-lab/proyectos/nexus/MEDICION_MODELOS_20261108.md`.

### Perfil de la vía Pi

Perfil `go-sprint` de gentle-pi (activo desde el 20-11):

| Rol | Modelo |
| --- | --- |
| orquestador y worker | `opencode-go/deepseek-v4.1-flash` (thinking high) |
| fix-agent y judge-a | `opencode-go/glm-5.3-flash` |
| explore | `opencode-go/deepseek-v4.1-flash` |
| verify | `opencode-go/deepseek-v4.1-flash` |
| judge-b y revisores | `openai-codex/gpt-6-luna` |
| review-risk | `openai-codex/gpt-6.2-sol` |

La fuente de verdad es `~/.pi/gentle-ai/models.json` (lo que Pi aplica); `profiles.json` guarda los perfiles. Se cambia con `/gentle:profiles` dentro de Pi (desde gentle-pi 4.5; `/gentle:models` ya no existe), no editando los `.md` de agentes.

Desde gentle-pi 5.1.0 / gentle-ai 5.1.0 (28-11):

- **Modo `organic`** (por defecto). Full delegation (desde 4.7) no se usa: el orquestador ya es barato y el pensar fuerte va fuera de Pi; su propia medición da 3-4 veces el tiempo de organic en tareas pequeñas.
- **Controlled Engineering activado** en `go-sprint` (`workflow` en `profiles.json`, tecla `c` en `/gentle:profiles`): worker, fix-agent y verify reciben reglas contra construir de más (cambio mínimo en la raíz, sin estados u opciones que nadie pidió, verificar en proporción, línea `Additions:` al cerrar).
- **El aviso de RDD antes de entregar ya no bloquea**, solo informa. El control sigue siendo la auditoría de DIA.
- Pi pregunta antes de tocar rutas fuera del worktree. Probado (28-11) con `pi -p`: escribe `encargos/<tarea>.ESTADO.md` sin pedir permiso. Si algún día se bloquea, que deje `ESTADO.md` dentro del worktree.
- Tras actualizar gentle-pi o gentle-ai: `gentle-ai sync` y comprobar que `profiles.json` sigue igual (copia `.bak-<fecha>` antes).

## GGA

GGA (el revisor de commits de gentle-ai) es **opcional**. Si se usa, su proveedor es `opencode:opencode-go/glm-5.3-flash`, nunca Claude.

## Ejemplos

- Vía Pi: Nexus, autocompletado CIMA en Validación (2026-10-24): `/srv/kairos-lab/proyectos/nexus/metis/odd/cima-autocomplete.md`.
- Vía OpenCode: los ejemplos de encargo están en `dia/OPENCODE.md`.
