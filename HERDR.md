# Herdr · trabajar dentro del VPS

Las sesiones de agentes de Sil corren en el VPS dentro de herdr (herdr.dev, 0.9.5): un multiplexor de terminal que conoce a los agentes. Cada proyecto es un espacio de trabajo (workspace) con su agente; el agente se ve en la barra lateral como `working`, `blocked` (espera aprobación o respuesta), `done` o `idle`.

Antes de usar herdr desde un agente: `test "${HERDR_ENV:-}" = 1`. Si falla, no se usa. La sintaxis manda en el binario (`herdr <grupo>` sin subcomando muestra la ayuda; `herdr --skill` da la guía para agentes). No ejecutes `herdr` a secas: abre la interfaz.

## Qué aporta

- **Persistencia**: si se corta el SSH, todo sigue corriendo (trenes de Metis, encargos, servidores). Si se reinicia el servidor de herdr, vuelve la disposición y las conversaciones de Claude, OpenCode, Pi, Codex y Hermes se reanudan solas (integraciones instaladas: `herdr integration status`).
- **Sil ve quién le necesita**: el estado de cada agente en la barra lateral, con aviso al terminar o al pedir aprobación.
- **Un agente puede abrir paneles y lanzar otros agentes o comandos**, leer su salida y esperar a que terminen. Es la base de los patrones de abajo.

## Patrones

### 1. Implementador de OpenCode Go en un panel visible (DIA, vía OpenCode)

Sustituye al «Bash en segundo plano» de `dia/OPENCODE.md` §4: Sil ve al implementador trabajar en directo, junto a la sesión que lo lanzó.

```bash
P=$(herdr pane split --current --direction down --cwd <worktree> --no-focus | jq -r '.result.pane.pane_id')
herdr pane run "$P" 'opencode run -m opencode-go/deepseek-v4.1-flash "Eres el implementador. … Lee y ejecuta el encargo de <ruta>" > <log absoluto> 2>&1; echo "__FIN rc=$?"'
herdr pane wait-output "$P" --regex '^__FIN rc=[0-9]+' --timeout 1800000
```

- La espera (`wait-output`) se lanza como Bash en segundo plano desde Claude Code, para que llegue el aviso de fin sin bloquear la sesión.
- La regex va anclada (`^`) y pide dígitos, para no casar con la propia línea del comando.
- Al terminar: se lee el log, se audita y se cierra el panel (`herdr pane close "$P"`; solo paneles propios).
- Varios encargos en paralelo: un panel por encargo (máximo 7 por modelo, `dia/OPENCODE.md`). Si el panel actual es ancho, se divide a la derecha; si es estrecho o alto, hacia abajo; si ya no caben, una pestaña propia (`herdr tab create --no-focus`).

### 2. Segundo revisor ciego en su panel

El revisor de las tareas M o sensibles (`dia/README.md`, «Segundo revisor») se lanza igual que el patrón 1, con la orden de `dia/OPENCODE.md` §5. Es parte de la única auditoría, no una revisión más.

### 3. Mensajes entre sesiones de proyecto

Una sesión puede escribir a otra directamente, sin que Sil copie y pegue:

```bash
herdr agent list                       # nombres y pane_id de los agentes vivos
herdr agent prompt <nombre|pane_id> "<mensaje>" --wait --timeout 600000
herdr agent read <nombre|pane_id> --source recent-unwrapped --lines 120
```

- Si responde `agent_blocked`, el otro agente espera a Sil: no se envía nada.
- Un `timeout` o `agent_prompt_stalled` no prueba que el mensaje no llegara: leer antes de reenviar.
- Si una respuesta larga no sale entera en `agent read`, se pide al otro agente que la escriba en un archivo y responda solo con la ruta.

### 4. Worktree por tramo como espacio de trabajo

`herdr worktree create --cwd <repo> --branch <rama> --base <ref> --no-focus` crea el worktree y lo abre como espacio agrupado con el del repo, así Sil ve cada tramo en la barra lateral. `herdr worktree list` los lista.

### 5. Avisar a Sil

Cuando una sesión se queda esperando un GO o una decisión: `herdr notification show "<proyecto>: GO pendiente" --body "<qué>" --sound request`. Herdr ya avisa solo cuando un agente termina o pide aprobación (salvo en la pestaña que Sil tiene delante); `notification show` es para lo que herdr no detecta.

### 6. Estado del tramo en la barra lateral

Cada espacio muestra debajo de la rama una línea `$estado` que pone la propia sesión:

```bash
herdr workspace report-metadata "$HERDR_WORKSPACE_ID" --source kairos:estado --token "estado=DIA ventas · esperando GO"
herdr workspace report-metadata "$HERDR_WORKSPACE_ID" --source kairos:estado --clear-token estado
```

- Se actualiza al cambiar de fase (diseño, implementando, auditando, esperando GO, tren 3/5) y se borra al cerrar el tramo. Máximo 80 caracteres.
- No sobrevive a un reinicio del servidor de herdr.

### 7. Plugin `kairos.actividad`

Plugin local (`~/.config/herdr-plugins/kairos-actividad/`, enlazado con `herdr plugin link`; copia versionada en `herdr/kairos-actividad/` de este repo). Con cada cambio de estado de cualquier agente:

- añade una línea `fecha · espacio · agente · estado` a `~/.local/state/herdr/plugins/kairos.actividad/actividad-<AAAAMMDD>.tsv` (sirve para medir cuánto espera cada sesión a Sil);
- mientras un agente está `blocked`, pone en su espacio la línea `$espera` («espera a Sil desde HH:MM») y la quita cuando vuelve a trabajar o termina.

Desactivar: `herdr plugin disable kairos.actividad`; quitar: `herdr plugin unlink kairos.actividad`.

### 8. Codex nativo en un panel (revisor o turno de noche)

Herdr reconoce Codex igual que a Claude y OpenCode (`herdr integration status`: los tres al día), así que el panel muestra `working`, `blocked` o `done`. Se elige así:

- **Revisión puntual, sin diálogo** (segundo revisor de DIA): `opencode run -m openai/gpt-6.2-sol` en un panel, como en el patrón 1. Es lo habitual: misma suscripción, arranque ligero y un log claro.
- **Sesión larga o desatendida** en la que Codex trabaja con herramientas y puede pedir aprobación: Codex nativo, para que herdr vea su estado y avise a Sil. Se lanza con `herdr agent start <nombre> --kind codex --pane "$P" -- -m gpt-6.2-sol` y se le habla con `herdr agent prompt`.
- Codex nativo carga unos 30 000 tokens de instrucciones en cada arranque (probado 18-11); por eso no se usa para revisiones cortas.
- Turno de noche (receta guardada en Engram #1250): un agente implementa y otro revisa cada diff; máximo 3 intentos por paso, y si se agotan se deja el paso marcado como bloqueado con su diagnóstico, no se repite. Siempre con ramas y worktrees propios, sin push ni merge sin GO.

## Configuración (13-11)

En `~/.config/herdr/config.toml` (copia previa: `config.toml.bak-20261113`): avisos dentro de herdr (`[ui.toast] delivery = "herdr"`, venían apagados) y dos líneas más en cada espacio (`$estado`, `$espera`). Tras editarlo: `herdr server reload-config` (no para nada). En 0.9.5 los tokens no admiten color ni reglas; la documentación web describe una versión más nueva.

## Reglas

- **Las aprobaciones son de Sil.** Ningún agente responde por otro a un diálogo `blocked` (ni con `agent send-keys` ni con `pane send-keys`).
- **No se cierra lo ajeno.** Solo se cierran paneles, pestañas y espacios que haya creado el propio agente. Nunca `herdr server stop`, `herdr session stop` ni matar el proceso de herdr: paran todas las sesiones. Es la regla de «no matar procesos ajenos» (`ARRANQUE.md` §4).
- **Borrar un worktree necesita GO propio**, también con `herdr worktree remove` (`ARRANQUE.md` §4). `--force` y `--trust-repository`, nunca por defecto.
- **Las pantallas son legibles entre sesiones.** Cualquier sesión puede leer la salida de otra: nada de datos reales de pacientes, credenciales ni secretos en ningún panel. `[experimental] pane_history` (guarda la salida en disco) sigue apagado.
- **Sin robar el foco**: paneles con `--no-focus`, para no mover a Sil de donde está; usar `--current` o IDs explícitos, nunca el panel que tenga el foco.
