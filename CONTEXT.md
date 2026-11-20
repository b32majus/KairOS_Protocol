# Atenea Context

Status: **CURRENT SYSTEM CONTEXT — C-087**

## Purpose

Atenea makes autonomous engineering work safer, reproducible and economical without rebuilding capabilities already owned by OpenCode or adopted upstream skills.

## Current architecture

```text
accepted product authority
→ existing Herdr operator workspace/pane
→ visible native OpenCode V2 TUI (`opencode .`)
→ selected Atenea profile
→ Matt skill appropriate to the work
→ fresh role-bound subagents / worktrees
→ deterministic evidence
→ one coordinator-owned independent Matt Standards + Spec review
→ up to two fresh finding-scoped corrections when needed
→ composed-state checks for material trains/features
→ Cora integrated audit at material PR/feature/train boundary
→ human publication / merge decision
→ post-merge worktree closeout
```

Atenea owns policy, bindings and conformance evidence. Material product shaping remains an attended Cora + human decision loop; OpenCode executes shaped authority and must STOP rather than self-answer unresolved product questions. Expansive shaping methods operate inside explicit non-negotiable product rails and conditional fidelity checkpoints. Product fidelity also survives decomposition/composition: internal domain richness and aggregate boundaries are not user-interface authority, and material cumulative UI is checked as a composed product when risk warrants it. Atenea does not own a second task graph, TDD method, review rubric, worktree algorithm or review lifecycle.

## Profiles

### `volume`

- coordinator: MiMo 2.6 Flash;
- explorer: Qwen 3.8 Flash;
- implementer: DeepSeek V4 Flash (provider currently serves V4.1 under this ID);
- merger: MiMo 2.6 Flash;
- Standards review: GPT-6 Luna high;
- Spec review: GPT-6 Luna high;
- correction: DeepSeek V4 Flash;
- deep OCR: normally off.

### `complex`

- coordinator: MiMo 2.6 Flash;
- explorer: Qwen 3.8 Flash;
- implementer: GLM 5.3 Flash high;
- merger: MiMo 2.6 Flash;
- Standards review: GPT-6 Luna high;
- Spec review: GPT-6.1 Sol high;
- correction: GLM 5.3 Flash high;
- deep OCR: GLM 5.3 Flash high when triggered.

`complex` remains a risk/assurance class, and under standard cost it now also selects the distinct GLM 5.3 Flash high first-writer route. This is fixed routing at a clean work-unit boundary, not quota-based switching.

## Complex triggers

Use `complex` for material semantic/acceptance risk such as cross-cutting architecture, difficult state/concurrency/temporal semantics, material auth/privacy/tenancy/clinical trust boundaries, delicate migration/back-compat invariants or repeated semantic failure.

Do not select it from file count, ticket length, ordinary UI work, number of tests or business importance alone.

## Thin execution + hardened preparation

C-087 retains the C-086 thin runtime/model/lifecycle shape. Before launch, Cora hardens the selected work so known seams and closed decisions do not have to be rediscovered by the writer. At runtime, child authority is passed by readable repo-local reference or compact inline capsule rather than inaccessible external paths. Post-run telemetry is observational/read-only. See `docs/CURRENT_EXECUTION_DECISION_C087.md`.

## Standard writer/context economy

Standard `volume` writes on V4 and standard `complex` writes on GLM 5.3 Flash high. The active OpenCode 2.0.22 runtime gives both long-running writers a 220k effective context budget with automatic compaction and ~15k recent verbatim retention, so pathological agent loops compact around ~198k instead of drifting toward the physical ~1M window. Required evidence is never reduced for token economy.

## Assurance

Deterministic gates remain first-line evidence. Semgrep is conditional on relevant static/security risk. Alibaba Open Code Review is selective high-risk/deep semantic assurance, not routine per-ticket review.

Feature/train/PR integrated audit is performed by Cora outside the OpenCode role graph when the boundary is material.

## Historical runtime

Gentle, Pi relay, ASSESS, RDD/4R, lineages, burn, review hosts and OpenCode V1 transport remain historical evidence only. They are not required by C-084.

Herdr remains supported operator infrastructure for persistent process/session control and observation; it is not correctness authority.

## Free cost-policy extension

Atenea also supports `cost_policy: free_only`, independent of the `volume|complex` risk class. Human/project cost authority wins; Free never silently escalates to paid bindings. See `docs/ATENEA_FREE_PROFILE_V0.md`.
