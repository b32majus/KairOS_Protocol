# Atenea

Este documento rige únicamente el protocolo Atenea dentro de KairOS_Protocol (índice: `PROTOCOLOS.md` en la raíz). Las rutas `docs/…`, `tools/…` y `.opencode/…` que cita son relativas a la raíz del repo.

Atenea is a thin upstream-first policy, routing and conformance layer for autonomous engineering work.

Current execution authority: **C-087 — C-086 thin native execution plus Cora pre-execution hardening, child-readable authority transport and read-only run telemetry**.

```text
accepted issue/spec
→ existing Herdr workspace/pane for persistent operation
→ visible native OpenCode V2 TUI (`opencode .`)
→ selected Atenea profile
→ Matt /implement or /implement-spec
→ role-bound subagents
→ deterministic checks/oracles
→ one coordinator-owned Standards + Spec review
→ up to two fresh finding-scoped corrections if needed
→ material composed-state closeout
→ Cora integrated audit when warranted
→ human publication/merge
→ post-merge cleanup
```

## Start here

Read:

1. `AGENTS.md`;
2. `docs/START_HERE.md`;
3. `CODING_STANDARDS.md`;
4. `CONTEXT.md`;
5. the current issue/spec/ADR authority.

Routing and agent bindings: `docs/ATENEA_EXECUTION_ROUTING_V0.md` and project-local `.opencode/agents/`.

## What Atenea does not own

Atenea does not fork Matt's TDD/task-graph/review methodology and does not rebuild an LLM execution/review lifecycle. Material product shaping is deliberately outside unattended execution: Cora + human close product decisions before launch, and OpenCode STOPs on newly discovered material product questions instead of answering them itself. `docs/ATTENDED_PRODUCT_SHAPING_GUARDRAILS_V1.md` constrains expansive shaping; `docs/PRODUCT_FIDELITY_GATES_V1.md` prevents internal domain/ticket decomposition and local hardening from silently becoming an over-complex composed UI. Historical Gentle/Pi/RDD/4R/lineage/burn material remains provenance only.

## Operator surface

Herdr remains supported for persistent sessions, observation and operator convenience. A project must remain semantically correct without hidden Herdr-specific authority.

## Publication

Review is evidence, not merge authority. Publication remains target-repository + explicit human authority. Delivery worktrees are normally cleaned after accepted merge, not merely after PR creation.

### Atenea Free

C-084 also supports the optional `free_only` cost policy through `atenea-free`. Cost policy is human/project authority and is independent from the `volume|complex` risk class. See `docs/ATENEA_FREE_PROFILE_V0.md` and the replaceable `docs/ATENEA_FREE_MODEL_CATALOG_V0.md`.
