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

## Dónde vive cada cosa

- `ARRANQUE.md`: prompt de arranque común para cualquier agente (y el prompt de apertura, §7).
- `HERDR.md`: cómo trabajar dentro de herdr en el VPS (paneles, otras sesiones, reglas).
- `dia/`: protocolo DIA (`README.md`), su vía OpenCode directo (`OPENCODE.md`) y la plantilla de la vía Pi (`PLANTILLA_TAREA.md`).
- `metis/`: resumen de Metis; el código está en su propio repo.
- `atenea/`: reglas y README de Atenea. Sus documentos (`docs/`), comprobadores (`tools/`) y agentes (`.opencode/`) siguen en la raíz para no romper las rutas que usan los proyectos y las Coras.
- La ruta antigua `/srv/kairos-lab/Atenea` sigue funcionando como enlace al repo.
