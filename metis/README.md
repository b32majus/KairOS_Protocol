# Metis

Metis es un **arnés ligero para trabajo desatendido**: un orquestador determinista, un writer, un gate determinista y un evaluador. El orquestador no improvisa: ejecuta fases definidas y deja evidencia en disco.

- Código y documentación técnica: `/srv/kairos-lab/qualification/metis-c091-20261019`.
- Versión congelada en uso: `/srv/kairos-lab/qualification/metis-pilot-9.9` (`node .../bin/metis.mjs`). Los configs con `portPolicy` solo cargan en 9.4 o posteriores.

## Flujo largo (una funcionalidad, varias unidades)

1. **Issue aprobado**, redactado con Cora.
2. **`plan-units`**: se parte el issue en unidades y se aprueba el plan. Las unidades son **verticales**: cada una lleva dominio, pantalla y test de recorrido juntos, no microreglas sueltas. Menos unidades, menos preparaciones.
3. **`prep-train`**: por unidad, el autor escribe el ticket, el oráculo y una referencia privada. Metis comprueba que el oráculo **falla en BASE** y **pasa 3/3 con la referencia**.
4. **Auditoría de la preparación por Cora**: aprobación antes de gastar writer.
5. **`train`**: el writer barato implementa; el gate y el evaluador deciden; hay correcciones acotadas.
6. **PR_READY** y **merge humano**.

Los oráculos comprueban solo el **contrato público** de la unidad (rutas, pantallas, funciones o campos que nombra el ticket), nunca nombres internos que inventó una referencia anterior.

La comprobación del paso 3 es la que da valor al conjunto: si el oráculo no falla en BASE, no mide nada; si no pasa con la referencia, la unidad no está bien preparada.

## Camino corto (un solo ticket)

Para un único ticket bien delimitado: **`prep` + `run`**. Se prepara el ticket y su oráculo, se comprueba contra la referencia y se ejecuta la unidad sin pasar por `plan-units`.

## Cuando algo falla: arreglos acotados

Un cambio concreto no justifica repetir el protocolo entero.

- **Oráculos incompletos tras la auditoría de la preparación**: se corrigen las aserciones en una rama nueva de prep, se pasa `metis prep-check` solo a esa unidad (debe fallar en BASE y pasar 3/3 con la referencia) y se lanza el train. Sin autor, sin plan y sin `prep-train` nuevo.
- **Unidad parada por infraestructura** (evaluador caído, gate de reanudación fallido): `metis train-resume`. Reanuda el mismo run sobre el mismo candidato; el writer no vuelve a ejecutarse.
- **Oráculo que ya no encaja con el código real (`ORACLE_DRIFT`)**: en un train, cada unidad se prepara sobre las referencias de las anteriores, pero se ejecuta sobre lo que escribieron los writers. Con `--prep-dir <directorio del prep-train>` en `train` o `train-resume`, Metis comprueba de nuevo la preparación de la unidad k sobre el código real antes de gastar su writer; si no pasa, para con `ORACLE_DRIFT`. Desde 9.7 ese recheck corre solo los oráculos de la unidad, sin suite, build ni capturas: eso lo sigue mirando el gate del writer. Arreglo: corregir solo el oráculo y la referencia de esa unidad sobre ese código, `prep-check` y reanudar.
- **Defecto visual que ya estaba en BASE**: no falla la unidad; queda como aviso «preexistente».
- **Oráculo de un trabajo anterior que el issue deja obsoleto a propósito**: el ticket lo lista en `supersedes` y la preparación lo actualiza al contrato nuevo (y lo ejecuta como testigo) o lo borra. Sin declararlo, Metis no deja tocar un oráculo existente. Dentro de un mismo train no se puede: si una unidad contradice a otra anterior, se cambia el plan. Sustituye a las WO manuales de «alineación de oráculos».
- **El cambio rompe a propósito un test existente**: ese test entra en `allowedPaths` del ticket, aunque esté fuera del plan, y el ticket explica por qué cambia. Queda como aviso para la auditoría.
- **Puerto ocupado por otro proyecto**: con `"portPolicy": "free"` en el `--repo-config`, la receta visual pasa a un puerto libre y el ocupante queda en el informe. Nunca se mata un proceso ajeno.

## Modelos

Los modelos se declaran por rol en el `--repo-config`:

```text
models.author
models.planner
models.reviewer
models.writerVolume
models.writerComplex
models.evaluator
```

Cada rol puede apuntar a un modelo distinto; el writer barato es el que más volumen consume.

El evaluador lee el `CODING_STANDARDS.md` del proyecto (`instructions` en el `--repo-config`) y, desde 9.8, busca además código duplicado, abstracciones que el ticket no necesita y comportamiento que el ticket no pide.

## Cuándo no usar Metis

Tareas pequeñas o atendidas → **DIA** (`dia/README.md`). Metis tiene sentido cuando el trabajo no se puede atender, dura horas o toca áreas de riesgo y merece oráculos demostrados antes de escribir código.

La vía se elige al empezar: si una unidad no merece una referencia privada, tampoco merece Metis y va por DIA.

## Regla de auditoría

**Nunca leer `reference.patch` en auditorías.** La referencia privada existe para demostrar que el oráculo discrimina, no para guiar la revisión: si el auditor la lee, deja de evaluar el resultado con criterios independientes.

## Revisión: una vez y basta (obligatorio)

En los runs reales, las comprobaciones de Metis se llevan menos del 20 % del tiempo; lo que más frena son las rondas de revisión alrededor. Estas reglas no son opcionales:

- **Una sola auditoría por preparación**, hecha por Cora, con veredicto **OK** o **REHACER**. Nada de segundas revisiones, revisiones cruzadas, enmiendas ni dictámenes sobre la misma preparación.
- **REHACER** lista solo defectos concretos (unidad, archivo, qué falla). Se arreglan por la vía acotada y **decide `prep-check`**, no otra auditoría completa.
- **No se crean documentos de revisión** (WO, ENMIENDA, REVISION, DICTAMEN, DECISIONES) salvo que Sil los pida. Una decisión de Sil es una línea en el `HANDOFF.md` del trabajo.
- **No se pide a Claude ni a otro agente** que revise algo ya auditado, salvo que Sil lo pida.
- **Testigos solo nuevos**: un ticket no lista como testigo tests que ya ejecuta la suite del proyecto (`pnpm test`, `verify:*`); la suite ya corre en el gate.
- Si dudas entre revisar otra vez o lanzar, lanza: el gate, el evaluador y el merge humano siguen ahí.
