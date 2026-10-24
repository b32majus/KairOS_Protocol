# Atenea — Repository Policy

Este repo contiene varios protocolos de trabajo (ver PROTOCOLOS.md). Lo que sigue rige únicamente el protocolo Atenea; DIA y Metis tienen sus reglas en `dia/` y `metis/`.

Status: **CURRENT AUTHORITY — C-087**

Atenea is a thin upstream-first policy, routing and conformance layer over native OpenCode V2 and adopted upstream engineering skills. It does not duplicate those skills or implement a second execution/review lifecycle.

## 1. Ownership

```text
WHAT / WHY / acceptance / domain authority
→ human + durable repository authority

human product design / interaction authority
→ attended Cora + human, when material

stable engineering quality
→ target repository AGENTS.md + CODING_STANDARDS.md

technical shaping / implementation / code review method
→ adopted Matt Pocock skills when invoked

role → model binding and assurance profile
→ Atenea project-local OpenCode agents + routing policy

machine-decidable facts
→ tests / typecheck / lint / validators / oracles / CI

process persistence / observation
→ Herdr when useful; never correctness authority

publish / merge
→ target repository policy + explicit human authority
```

## 2. Authority precedence

1. accepted current product/domain authority;
2. accepted spec/ticket/work order for the current change;
3. target-repository policy and coding standards;
4. current Atenea execution/routing authority;
5. adopted upstream skill instructions;
6. upstream runtime defaults;
7. historical docs, stale config and remembered session state.

Material conflict between current authorities => STOP and reconcile. Runtime convenience never invents product semantics.

## 3. Read only what the work needs

Normal engineering entry is deliberately small:

1. this file;
2. the accepted issue/spec/ticket or durable execution handoff;
3. `CODING_STANDARDS.md` and only the relevant project/domain authority it references;
4. `docs/ATENEA_EXECUTION_ROUTING_V0.md` when executing through Atenea.

Do not load product-design, shaping, fidelity, qualification or historical documents by ritual. Specialized policies are referenced when their condition is explicitly triggered; they are not default execution payload.

Historical C-077–C-085 and Gentle/Pi/OpenCode V1 runbooks remain provenance unless current authority explicitly cites them.

## 4. Do not duplicate Matt

Matt skills own their methodology. Do not copy their TDD loop, task-graph procedure, code-review rubric or worktree choreography into Atenea policy, project handoffs or child prompts.

Atenea adds stable repository constraints, explicit role/model bindings, deterministic evidence boundaries and human publication control.

Atenea separates **risk class** (`volume|complex`) from **cost policy** (`standard|free_only|go`). A separately human-authorized **operative, human-activation-only** Sprint/Frontier route retains the legacy `openai_experimental` key under `docs/ATENEA_OPENAI_EXPERIMENTAL_PROFILE_V0.md`; it does not alter qualified routes or the default. Cora may recommend risk class; human/project authority owns cost policy. `free_only` and `go` have no silent provider/model fallback. See the profile documents for their replaceable bindings.

Thin field recovery amendment (2026-10-17): `docs/C087_THIN_WRITER_REVIEW_AND_EVIDENCE_RECOVERY_20261017.md` prevents auto-replacement writers/phase splits after empty child returns, encourages concurrent applicable reviews in the same Matt-owned window and bounds tests/screenshots. Applies at future clean boundaries only, without any model, method or budget changes.

Only for **Free** UI-impact units, `docs/ATENEA_FREE_VISUAL_UX_ROUTING_V1.md` adds a **conditional read-only visual evidence axis** on the same fixed candidate. Cora fixes visual intent and authority upstream; this does not alter the canonical Matt Standards+Spec pair or correction budget.

Only for **Standard** UI-impact units, `docs/ATENEA_STANDARD_VISUAL_UX_ROUTING_V1.md` adds an analogous conditional Luna High visual evidence axis. The Standard writer remains risk-bound to DeepSeek Volume or GLM Flash High Complex. Free and Go routes remain unchanged; no extra Matt review or correction budget.

Only for explicitly **human-activated OpenAI** UI-impact units, `docs/ATENEA_OPENAI_VISUAL_UX_ROUTING_V1.md` adds read-only Sol High (Sprint) and Luna High (Frontier) visual witnesses, without changing their underlying models, risk classes, Matt lifecycle or the correction budget. This addendum does NOT authorize automatic activation, new model bindings or claims of comparative superiority.


C-087 retains C-086/C-085 routing and context economics over C-084 native V2: OpenCode 2.0.22 was the known-good decision baseline; CLI 2.0.26 was promoted after a bounded Go canary (extended post-upgrade field endurance pending). Standard Volume writes with DeepSeek V4 Flash and Standard Complex with GLM 5.3 Flash high. The inherited 220k effective NaN writer context guard has auto-compaction guidance around ~198k with ~15k recent retention; the Go canary did not stress-test that guard. Go was operationally qualified for bounded volume/complex work with its earlier accepted bindings; its revised bindings remain pending separate field evidence. Free V2 Volume/Complex bindings were explicitly human-approved on 2026-10-16 without new quality bake-offs and do not inherit NaN/paid-endpoint qualification. Routing changes only at a clean work-unit boundary.

Do not rewrite shared `~/.config/opencode/opencode.json` as per-ticket/train routing state. Do not add `--pure`: it is a V1 flag and is not part of native OpenCode V2.

## 5. Deterministic-first, phase-scoped evidence

If a material property can be expressed deterministically, prove it mechanically. Do not create an oracle for every edit.

Evidence belongs to the phase that needs it:

```text
writer      → focused TDD + smallest relevant deterministic checks
integration → merge-sensitive / cross-slice checks when justified
review      → inspect candidate + existing evidence; request new proof only for a concrete gap
corrector   → finding-scoped fix + focused regression evidence
publication → changed-artifact / composed-candidate closeout
```

Broad/full suites are integration/publication evidence by default, not a ritual for every writer slice. A ticket/repository may require an earlier broad suite when that is genuinely necessary; otherwise do not repeat it at every phase.

## 6. Cora-shaped execution envelope

OpenCode/Matt execute already-accepted bounded work. Precision is not verbosity: reference durable authority and state only the semantic delta.

A handoff names the outcome, authority refs, in-scope surface, principal invariants, non-goals, evidence needed to close the writer phase, publication boundary and any **explicitly triggered conditional safeguard**. It does not restate `AGENTS.md`, coding standards, Matt methodology or entire product histories.

Material product choices are attended Cora + human work. If execution exposes an unresolved material product/architecture/scope/privacy/data-semantics/acceptance choice, HUMAN STOP rather than infer an answer.

Specialized safeguards remain available but are phase-owned and conditional:

- material human-facing design → `docs/HUMAN_PRODUCT_DESIGN_AUTHORITY_V1.md` upstream of execution;
- expansive shaping → `docs/ATTENDED_PRODUCT_SHAPING_GUARDRAILS_V1.md` upstream;
- product fidelity / representation / shared-seam questions → `docs/PRODUCT_FIDELITY_GATES_V1.md` when explicitly triggered;
- publication closeout → `docs/PREPUBLICATION_ARTIFACT_VALIDATION_V1.md` at the final candidate boundary.

A writer is not a repository-wide auditor. It implements the accepted envelope. If it incidentally discovers a material affected surface or authority conflict outside that envelope, it reports the fact and STOPs; it does not start open-ended sibling tracing or broaden scope.

## 7. Lifecycle ownership and bounded correction

The selected primary coordinator owns `/implement` or `/implement-spec`, one canonical Standards + Spec review, review aggregation and correction dispatch. Implementation workers own implementation/TDD, focused implementation evidence and the candidate commit only. They do not invoke `/implement`, `/implement-spec`, `/code-review`, reviewers or correctors.

When delegating, coordinators use child-readable authority transport: a repo-local durable handoff reference when readable from the current worktree, otherwise a compact phase-specific authority capsule. Never make a child verdict depend on `/outbox`, `/tmp`, another worktree or another external directory. Do not copy the full handoff/policy corpus into a second giant prompt.

Review start closes the originating implementer's write phase. Every review-driven mutation goes through a fresh bound corrector.

Allow at most two fresh finding-scoped correction attempts:

```text
IMPLEMENT
→ REVIEW
→ clean → DONE
→ findings → fresh corrector #1 → focused evidence
    → resolved → DONE
    → same findings remain → fresh corrector #2 → focused evidence
        → resolved → DONE
        → blocker / new material issue → HUMAN STOP
```

Correctors close supplied findings; they do not search for new sibling defects by default. If a review finding explicitly requires an adversarial witness or named conditional safeguard, the corrector supplies only that bounded closure.

## 8. Herdr and operator-controlled launch

Herdr is the already-running persistent operator surface. Do not launch/restart/replace it per ticket/train.

For real work, Cora prepares through `READY_TO_LAUNCH`; the human performs the final visible launch unless that specific launch is explicitly delegated. The preferred first prompt is short:

`Read @docs/handoffs/TRAIN_X.md and execute it under current repository/Atenea authority.`

Do not use `opencode run` as the normal production surface.

## 9. Repository entry, worktrees and publication

Use `docs/REPOSITORY_ENTRY_RECONCILIATION_V1.md` read-only when prior harness/tooling state is ambiguous. Matt owns ephemeral implementer worktrees while its workflow is active; delivery/integration worktrees remain through accepted publication closeout.

Before publication, validate the artifact types that actually changed and the composed candidate as required by `docs/PREPUBLICATION_ARTIFACT_VALIDATION_V1.md`. Review approval is not push/PR/merge/deploy authority. No automatic merge, force-push or destructive history recovery.
