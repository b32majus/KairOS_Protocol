# Documento de tarea — <título>

> Plantilla de la vía Pi + ODD. En la vía OpenCode directo, el test RED y el encargo de `dia/OPENCODE.md` sustituyen a este documento.

## Repo y rama

- Repo: `<ruta o nombre>`
- Rama de trabajo del proyecto: `<rama>`
- Rama a crear para la tarea: `<tipo>/<tarea>`

## Problema

<Qué está mal o qué falta, en dos o tres frases. Sin proponer solución todavía.>

## Hipótesis de diagnóstico (opcional)

<Causa probable y cómo comprobarla. Si no hay hipótesis clara, dejar en blanco.>

## Comportamiento acordado

<Qué debe hacer el sistema al terminar, descrito como comportamiento observable. Es el contrato que se implementa y se audita.>

## Alcance (qué no tocar)

- <Ficheros, módulos o áreas que sí entran.>
- No tocar: <zonas fuera de alcance, dependencias, configuración, otros repos>.
- Restricciones del proyecto: <las que apliquen del AGENTS.md del repo destino>.
- Normas de código: el `CODING_STANDARDS.md` del repo destino; si no tiene, el común `/srv/kairos-lab/KairOS_Protocol/CODING_STANDARDS.md` (y se avisa a Sil de que falta).

## Piezas existentes que se deben reutilizar

<Funciones, componentes, estilos o variables que ya hacen parte de lo pedido, con su ruta. Quien diseña las busca antes de escribir este documento. Si no hay ninguna: «ninguna: se buscó <qué> en <dónde>». Si al implementar parece que algo ya existe y no está aquí, se reutiliza o se para y se avisa; no se crea una copia.>

## Parte visual (solo si la tarea toca pantalla)

<Piezas del catálogo de diseño que se usan, dónde va cada una (con captura o pantalla de referencia) y cómo se ve vacía, cargando, con error y en móvil. Sin estilos, colores ni medidas nuevas. Norma: `PROTOCOLOS.md`, «Trabajo visual».>

## Criterios de aceptación

Entre 5 y 10, cada uno verificable con un test:

1. <Criterio observable.>
2. <Criterio observable.>
3. ...

## Cierre

- Commit en la rama de la tarea, **sin push**.
- `<tarea>.ESTADO.md` con:
  - causa o problema encontrado;
  - cambios realizados (ficheros y motivo);
  - tests ejecutados y resultado.
  - una línea final con el formato `Inicio: <fecha hora> · Cierre: <fecha hora> · Veredicto: OK|REHACER · Vueltas: N`; la rellena el auditor al emitir el veredicto. Sirve para medir el flujo sin adivinar.
