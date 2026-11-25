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

## Trabajo visual (DIA y Metis; norma de Sil, 21-11, todos los proyectos)

Los modelos baratos implementan bien, pero no deciden bien cómo se reparte y se ve una pantalla. En lo visual, decide el modelo fuerte y el barato ejecuta; las instrucciones no bastan, hace falta comprobar.

- **Mecánico** (pasar valores sueltos a variables, aplicar un patrón que ya existe): modelo barato.
- **Diseño** (pantalla nueva o redistribución): el modelo fuerte, o Claude Design, hace una maqueta y Sil la aprueba. Después el barato la copia y se compara su captura con la maqueta. Si falla dos veces, la implementa el fuerte.
- **Mixto** (función + interfaz: un botón con acción, un buscador, una barra lateral): el barato hace la función y coloca piezas del catálogo de diseño del proyecto (`DESIGN.md` y página de muestra). Si la pieza no existe, primero la diseña el fuerte, Sil la aprueba y entra en el catálogo; se diseña una sola vez.
- **Comprobación siempre:**
  - un check rechaza colores o medidas fuera de las variables;
  - capturas antes/después: lo que no se tocaba debe salir idéntico;
  - el modelo fuerte revisa la captura de lo nuevo antes de preguntar «¿lo subo?».
- **Evitar el aspecto «hecho con IA»** (norma de Sil, 22-11, todos los proyectos). Sil lo rechaza por sistema:
  - raya gruesa de color en el lado de una tarjeta o aviso (usa borde fino uniforme del color del estado, fondo suave y texto que diga el estado);
  - degradados sin motivo, cristal translúcido (glassmorphism) y sombras exageradas;
  - emojis como iconos;
  - decoración que no lleva información.
  Estilo por defecto: sobrio, institucional, pocas piezas y siempre las mismas. Un color solo se usa para lo que significa en ese proyecto (en Nexus, por ejemplo, el verde nunca va en botones). El color nunca es la única señal.
- **Cada proyecto con interfaz tiene su `DESIGN.md`** (colores, medidas, tipografía, catálogo de piezas y qué pieza usar para cada cosa) en la raíz de su repo, y el agente lo lee antes de tocar pantallas. Las reglas del proyecto mandan sobre las de aquí en colores y medidas; esta lista de «evitar» vale siempre. Si el proyecto no lo tiene, lo escribe primero el modelo fuerte con Sil.

## Lanzar agentes: trampas conocidas (25-11-2026)

Se aprendieron al recuperar la ejecución de agentes desde ChatGPT/Hermes. Valen para todos los proyectos.

- **Éxito = resultado, no código 0.** Un agente que sale con 0 puede no haber entregado nada. Un revisor debe devolver una línea `DICTAMEN: OK` o `DICTAMEN: REHACER`; sin ella, la revisión no existe.
- **Ejecutables.** `opencode`, `pi` y `codex` viven en `~/.npm-global/bin`. Las shells sin terminal (Hermes, conectores) lo ven solo por `~/.profile`; `~/.bashrc` sale pronto. Dentro de herdr, `HERDR_ENV=1`; fuera es vacío y es normal: no se fuerza.
- **OpenCode 2.4.x.** `opencode models` no admite proveedor (usar `opencode models | grep opencode-go`). Para scripts: `opencode run --standalone --archived -m opencode-go/<modelo> -f <paquete> "<prompt>"`; `--agent plan` deja la revisión en solo lectura. Una revisión real tarda 3-4 minutos: plazo de al menos 300 s.
- **Pi.** Arranque normal ~8 s (con red); en scripts, `PI_OFFLINE=1`. Revisión de solo lectura: `pi -p --no-session -t read,grep,find,ls ...`. Nunca `--no-tools`/`-nt` con DeepSeek: devuelve sus llamadas como texto (`<｜DSML｜ ...>`) sin dictamen.
- **Perfil gentle-ai.** Cada repo puede fijar un perfil (pin local en `<git-dir>/gentle-ai/profile-pin.json` o `.pi/gentle-ai/profile.json`) que pisa al activo. El perfil vigente es `go-sprint`; un pin a `native-*` o `nan-*` (NaN, cancelado) da `401 Invalid API key`.
- **Modelos de OpenAI.** Solo por OpenCode (`openai/gpt-6.2-sol`) o Pi (`openai-codex/gpt-6.2-sol`), con la suscripción de Sil ya cargada. Codex CLI no, salvo GO. Hay tres instalaciones de `codex`; la válida es la de `~/.npm-global/bin`.
- **Afirmaciones sobre navegadores.** Un revisor que afirme un comportamiento de CSS (por ejemplo, qué hace `container-type` con `position: fixed`) debe medirlo en Chromium y Firefox con Playwright antes de dar un hallazgo como bloqueante.
- **QA de uso con navegador real (Hermes).** Para probar una app como lo haría una persona: `hermes chat --oneshot -t browser,terminal -s dogfood --query-file ENCARGO.md --format stream-json`. Hace falta `terminal` en la sesión (sin él Hermes oculta `browser_exec`) y `browser-harness` en el venv de Hermes. Una copia desechable de la app, una sola tanda a la vez (matar el cliente no para al agente), 3 tareas por tanda, y éxito = tareas hechas con evidencia, no código 0. Es QA de agente, no validación humana. Guía y causa del fallo del 25-11: `/srv/kairos-lab/docs/QA_EXPLORATORIO_NAVEGADOR.md`.

## Dónde vive cada cosa

- `ARRANQUE.md`: prompt de arranque común para cualquier agente (y el prompt de apertura, §7).
- `HERDR.md`: cómo trabajar dentro de herdr en el VPS (paneles, otras sesiones, reglas).
- `dia/`: protocolo DIA (`README.md`), su vía OpenCode directo (`OPENCODE.md`) y la plantilla de la vía Pi (`PLANTILLA_TAREA.md`).
- `metis/`: resumen de Metis; el código está en su propio repo.
- `atenea/`: reglas y README de Atenea. Sus documentos (`docs/`), comprobadores (`tools/`) y agentes (`.opencode/`) siguen en la raíz para no romper las rutas que usan los proyectos y las Coras.
- La ruta antigua `/srv/kairos-lab/Atenea` sigue funcionando como enlace al repo.
