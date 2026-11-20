# DIA · vía OpenCode directo

Variante de la fase Implementar de DIA (`dia/README.md`) sin Pi ni ODD: quien diseña escribe el test RED y un encargo estricto, y un modelo de OpenCode Go lo ejecuta con `opencode run`. El resto de DIA (situación de partida, línea base, auditoría, una sola revisión, GO) no cambia.

En esta vía, el encargo sustituye al documento de tarea y a `ESTADO.md`: el informe es la respuesta de ≤12 líneas del implementador más el diff.

## Requisitos

- OpenCode con el proveedor `opencode-go` conectado (`opencode auth list` lo muestra como «stored»); `opencode models | grep opencode-go` lista los ids.
- Un worktree y una rama propios para el tramo.
- Si `opencode run` se queda colgado contra un `opencode serve` en segundo plano, se lanza con `--standalone`.

## 1. Test RED

- Lo escribe quien diseña: es el contrato del encargo. Si el proyecto tiene una plantilla de check, se copia y se escriben solo los casos; no se recorta otro check.
- Se comprueba que da rojo **por la razón correcta** antes de escribir el encargo.

## 2. Encargo

Se guarda fuera del worktree, con ruta absoluta (por ejemplo `<carpeta de control>/PLAN_EJECUTOR_<TEMA>_<AAAAMMDD>.md`). Secciones fijas; el bloque «Lo que NO puedes tocar» se copia tal cual y se añaden las reglas del proyecto:

```
# Encargo al ejecutor — <título> (issue #NNN, tramo X)
Worktree: <ruta> (rama <rama>).

## Objetivo
Hacer pasar `<ruta del test o check>` (nuevo). Léelo entero: es el contrato.
<problema real en 2-4 líneas + decisión de Sil>

## Lo que SÍ puedes tocar
<ficheros y, dentro de cada uno, funciones concretas>

## Piezas existentes que debes reutilizar
<funciones, componentes, estilos o variables que ya hacen parte de lo pedido, con su ruta. Úsalas tal cual; puedes modificarlas solo si aquí se dice. Si no hay ninguna, escribe «ninguna: se buscó <qué> en <dónde>».>
Si necesitas algo que no está en esta lista y crees que ya existe, PARA y descríbelo; no crees una copia.

## Lo que NO puedes tocar (STOP si crees que hace falta)
- Ningún test, check, fixture, documento ni otro fichero. No git. No instales nada.
- NO lances revisiones, subagentes ni workers: implementa tú y comprueba.
- NO ejecutes nada que no esté en «Cómo comprobar».
- <reglas del AGENTS.md del proyecto que apliquen>
- <módulos o funciones concretas que no se tocan>

## 1..N. <pasos, con nombres exactos de funciones, ids y textos literales>

## Cómo comprobar (todos deben dar 0)
<un único comando con el check nuevo y los checks vecinos>
Máximo 3 intentos por fallo. Si un test te parece contradictorio con estas reglas, PARA y descríbelo sin tocar el test.
<checks que ya fallaban en la línea base: «ya fallan antes; no deben empeorar»>

Al terminar responde en ≤12 líneas: qué cambiaste (líneas +/− por fichero), el resultado de cada comando y CUALQUIER lógica añadida solo para pasar un test.
```

Antes de lanzar, quien diseña relee el encargo como si fuera el implementador, sin el contexto de la conversación. No es una revisión aparte, es parte de escribirlo. Comprueba tres cosas:

- cada paso dice qué fichero y qué cambiar, no «actualizar el servicio X»;
- no deja decisiones de diseño al implementador: tipo de dato, firma, qué hacer ante un error, qué texto ve el usuario;
- los ficheros y funciones que cita existen, o están marcados como nuevos;
- cada pieza nueva que pide (función, componente, estilo) se buscó antes en el repo, y lo que ya existía está en «Piezas existentes que debes reutilizar».

## 3. Línea base

Antes de lanzar, se pasan los checks vecinos sobre el worktree sin tocar (`dia/README.md`, Flujo, paso 3) y se anota el resultado en el encargo.

## 4. Lanzar

El rol de implementador y la prohibición de delegar van **en la propia orden**, no solo en el encargo. Es el fallo más caro visto: el modelo lanza un «implementador» aparte o se cree coordinador y termina sin tocar nada. Medido en Nexus, esa capa de delegación se llevaba ≈60 % de la entrada y ≈77 % de la caché.

```
cd <worktree> && opencode run -m opencode-go/deepseek-v4.1-flash "Eres el implementador. Edita tú mismo los ficheros; PROHIBIDO delegar, lanzar subagentes o revisiones. Tu rol en esta sesión es IMPLEMENTADOR, no coordinador. Lee y ejecuta el encargo de <ruta absoluta del encargo>" > <ruta ABSOLUTA del log> 2>&1
```

- Si el repo tiene un `AGENTS.md` con agentes coordinadores, se nombra en la frase el agente implementador que corresponda (por ejemplo, en repos con Atenea: «IMPLEMENTADOR (atenea-implementer-volume)»).
- El modelo por defecto es `opencode-go/deepseek-v4.1-flash`; los cambios de modelo siguen `dia/README.md`, Modelos.
- Desde Claude Code: Bash con `run_in_background`, con `opencode` como proceso principal. Nunca `nohup`, `&` ni subshell: así Sil lo ve y llega el aviso de fin.
- Dentro de herdr (VPS), mejor en un panel visible al lado de la sesión: `HERDR.md`, patrón 1.
- Varios encargos en paralelo: una llamada en segundo plano por encargo. Los límites de concurrencia de OpenCode Go están sin medir: si da errores de límite, se lanzan menos a la vez.
- No se vigila con `pgrep -f` ni con bucles `while`: se encuentra a sí mismo y no termina. Se espera el aviso de fin.

## 5. Auditar

Se aplica la lista de auditoría de `dia/README.md`. Además:

- se relanza uno mismo el comando de «Cómo comprobar»;
- los fallos sospechosos de ser previos se comprueban contra HEAD en un worktree temporal propio, nunca con `stash`, `checkout` ni `reset` en el worktree del implementador;
- los arreglos de pocas líneas tras la auditoría (un test propio, quitar lógica añadida solo para pasar un test) los hace directamente quien audita, sin relanzar.

En tareas M o sensibles se lanza además el segundo revisor (`dia/README.md`, «Segundo revisor»), antes de que el auditor dé el veredicto y sin pasarle la auditoría:

```
cd <worktree> && opencode run -m openai/gpt-6.2-sol "Eres REVISOR de solo lectura. PROHIBIDO editar ficheros, ejecutar git que modifique nada, instalar o delegar. Lee los criterios y el encargo de <ruta absoluta del encargo> y revisa el diff (git diff <rama base> y git status). Busca: criterios no cumplidos o sin test, lógica añadida solo para pasar un test, decisiones que el encargo no tomaba y el implementador tomó por su cuenta, cambios que ningún criterio pide, errores de lógica, casos límite, seguridad y datos. Responde en ≤15 líneas: un hallazgo por línea (fichero:línea · qué falla · gravedad alta/media/baja), o «sin hallazgos»." > <ruta ABSOLUTA del log> 2>&1
```

En tareas **sensibles**, se añade a esa misma orden, antes de «Responde en ≤15 líneas»:

```
Además, ATACA lo que toca el diff como lo haría alguien con malas intenciones, solo en local y con datos sintéticos, sin editar nada: entra sin sesión o con un usuario pide datos de otro; prueba contraseñas o códigos sin límite; intenta saltarte cada regla de negocio por otra vía que no sea el botón; mete en cada entrada texto muy largo, HTML, <script>, caracteres especiales y números en el límite; busca claves, contraseñas o datos reales en el código, en lo publicado y en lo que llega al navegador. Puedes arrancar la app en local y mandarle peticiones; di qué intentaste aunque no encuentres nada.
```

- Si el auditor es Cora o no hay OpenAI, se cambia `-m` por el modelo de OpenCode Go que no implementó.
- Tras la revisión, `git status` del worktree debe seguir igual. Si cambió, se descarta su informe y se avisa a Sil.

## 6. Documentos mecánicos

Contratos, filas de decisiones, descripción de la PR y similares pueden ir a OpenCode Go (`opencode-go/mimo-v2.6-flash`, el más barato en NaN, o `opencode-go/deepseek-v4.1-flash`) con el `git diff` y un patrón fijo; quien diseña revisa el resultado. El test RED y la auditoría no se delegan.

## 7. Cerrar el tramo

- El encargo se archiva (por ejemplo en `archivo/planes/`).
- Se reescribe el bloque «EMPEZAR AQUÍ» del `HANDOFF.md` (`ARRANQUE.md` §6). Un tramo es una sesión.
- Push, PR y merge: con GO de Sil, individual o en bloque (`ARRANQUE.md` §4).

## QA con checks de navegador

Patrón reutilizable en cualquier proyecto con interfaz: los modelos baratos (medido con NaN, mismos modelos que OpenCode Go) escriben bien checks de navegador de **solo lectura** (Playwright headless). Cada check imprime OK, FALLO, INFO o NOTA, afirma con DOM y texto, y las capturas son solo para humanos. En Nexus cerraron un lote de QA en un día; solo quedó manual un ticket de criterio humano.

## Ejemplos y herramientas (Nexus, solo lectura)

- Skill del ciclo: `/srv/kairos-lab/proyectos/nexus/.claude/skills/encargo-dia/SKILL.md`, con `plantilla_check_navegador.mjs` al lado.
- Lanzador de checks: `/srv/kairos-lab/proyectos/nexus/bin/run_checks.sh` (un log por check, salida «nombre rc», timeout).
- Encargos: `/srv/kairos-lab/proyectos/nexus/archivo/planes/PLAN_EJECUTOR_EA_DETALLE_CAUSALIDAD_20261108.md` (código), `..._MORISKY_EXPORT_20261108.md` (arreglo pequeño) y `..._QA676_20261108.md` (check de QA).
