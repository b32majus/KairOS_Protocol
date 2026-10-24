# Documento de tarea — <título>

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
