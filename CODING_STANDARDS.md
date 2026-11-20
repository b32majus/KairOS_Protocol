# Engineering Coding Standards

Common template for every KairOS code repository. Each repo keeps its own copy as `CODING_STANDARDS.md` at its root (that is the file DIA and Metis read) and appends its project-specific rules in a final section of its own (for example, Nexus adds clinical rules). Source of this version: Nexus `promueve/nexus-v4` (#955, 2026-11-19) without its PROMueve-specific parts.

This file contains the repository's stable horizontal engineering guardrails. It does **not** define an execution sequence or a review lifecycle; the protocol in use (DIA, Metis or a manual review) supplies the method, and this file supplies the guardrails. Machine-decidable rules belong in deterministic repo tooling: if a recurring quality failure can be expressed as a linter, type rule, schema check, test or CI guardrail, prefer that executable guardrail over adding another prose rule here. Deterministic evidence is the first-line acceptance signal.

## 1. Keep changes scoped

Make the smallest coherent change that satisfies the current contract.

Do not refactor, rename, reorganize or "clean up" unrelated code unless doing so is necessary to implement the requested behavior safely.

If unrelated debt or defects are discovered, report them separately rather than silently expanding the change.

## 2. Prefer changeability over cleverness

Choose designs that are easy to understand, modify and delete.

Do not add speculative abstractions, indirection, generic frameworks, services or extension points without demonstrated change pressure.

A locally explicit design is preferable to a globally "flexible" one that increases cognitive or operational cost.

Do not abstract repetition merely because code looks similar. Deduplicate when repeated code represents the same knowledge, rule or reason to change; keep coincidentally similar behavior separate.

Before adding a function, component, style or variable, search the repository for an existing one that does the same job and reuse it. If you still create a new one, state in your report what you searched for and why the existing one did not fit.

Keep behavior that changes for the same reason close enough to understand and modify coherently. Avoid scattering one logical change across unrelated modules without a demonstrated boundary that earns the separation.

## 3. Follow local consistency and expose intent

Respect the established architecture, vocabulary and conventions of the code being changed unless the work explicitly changes those conventions.

Do not introduce a new architectural or stylistic pattern merely because it is attractive in isolation.

When a local convention is actively harmful to the requested change, make that conflict explicit and change it deliberately rather than drifting into a second competing pattern.

Names should expose domain intent. Avoid vague, generic or misleading names that require implementation knowledge or explanatory comments to understand what a concept represents. Prefer the repository's established domain vocabulary.

## 4. Introduce seams and abstractions only under real pressure

Introduce interfaces, adapters or abstraction seams when there is demonstrated variation, substitution, isolation or testability pressure.

Do not create abstraction layers for hypothetical future implementations or merely to satisfy a design pattern.

Prefer the simplest boundary that preserves locality and lets the current behavior be changed or tested safely.

## 5. Preserve one authority and remove obsolete design

Do not create competing sources of truth for the same durable fact.

When a contract changes, remove code, tests, adapters and branches of design that no longer serve a real supported behavior.

Backward compatibility, migrations or temporary dual paths are justified only when a real consumer, persisted contract or rollout requires them. Give temporary compatibility a retirement condition.

Record durable, non-obvious architectural or domain decisions in the repository's normal authority surface (for example `CONTEXT.md`, ADRs, specs or canonical product docs), not only in chat, commit messages or agent memory.

## 6. Technical debt must be intentional

Technical debt may be accepted when the trade-off is worth it, but it must be visible, bounded and owned by a person, team, issue or explicit remediation condition.

Do not silently accumulate compatibility layers, TODO architecture, duplicated implementations or temporary shortcuts as permanent design.

## 7. Verification must be meaningful

Prefer deterministic verification that can independently disagree with the implementation.

Do not add tautological tests or checks that merely restate the implementation.

Use TDD when it applies. Do not force TDD for wiring-only, generated, declarative or purely visual changes when it would provide no independent oracle.

Negative and adversarial verification should be proportional to actual risk, especially around authorization, parsing, trust boundaries, migrations, failure/retry behavior, state transitions and destructive operations.

For stateful, temporal, concurrent, cached or idempotent behavior, add at least one regression case that would fail a plausible stale-state, wrong-order, duplicate/retry or repeated-operation implementation when that risk is material. Prefer an executable invariant/interleaving check over another prose warning.

## 8. Fail explicitly when correctness requires knowledge

Do not hide invariant, authority, persistence or safety failures behind silent fallbacks, guessed defaults or "best effort" success.

When correctness depends on knowing, `UNKNOWN` is not `SUCCESS`.

Return or propagate actionable failures. Make retry, idempotency and recovery semantics explicit when operations may repeat or produce persistent side effects.

Preserve enough diagnostic context to understand failures without leaking secrets.

## 9. Dependencies must earn their cost

Add a dependency only when it provides concrete value that is not reasonably available from the existing stack or a small local implementation.

Consider maintenance, transitive risk, runtime weight, upgrade burden and lock-in. Remove dependencies that no longer justify their cost.

Do not build internal substitutes for mature upstream capabilities merely to avoid a dependency that the architecture has already adopted.

## 10. Security and data boundaries must be explicit

Apply least privilege and minimize credential and data exposure.

For sensitive or persistent data, make ownership, trust boundaries and mutation authority explicit.

Never log secrets or credentials. Avoid broad environment or credential propagation when a narrower boundary is available.

Security controls should match the actual threat and risk model; do not invent a bespoke security platform without a concrete requirement.

## 11. Performance and scale require evidence

Optimize when requirements, measurements or credible load characteristics justify it.

Do not pre-emptively introduce caches, queues, sharding, microservices, distributed coordination or generic scalability abstractions.

Here, "scalable" means the software can be understood, modified, tested, operated and extended without each change multiplying fragility.

## 12. Validate and canonicalize once at boundaries

Treat imported workbooks, user input, tool output and external payloads as untrusted until they cross an explicit validation boundary. Validate structural and semantic requirements as early as practical, then carry the validated representation forward instead of rematching or renormalizing the same durable fact in multiple layers.

When aliases or identifiers can map to one canonical entity, ambiguous matches fail closed. Preserve source identity/provenance when diagnostics, audit or round-trip behavior requires it.

## 13. Configuration must be reproducible

Behavior-affecting configuration must be explicit, inspectable and reproducible from repository state plus separately supplied credentials. Do not make correctness depend on undocumented global plugins, inherited shell state or hidden home-directory mutations. Required configuration that is stale, incompatible or missing must fail visibly rather than silently selecting another execution mode.

## 14. User-facing changes remain operable and accessible

When a change affects UI, accessibility is part of correctness: prefer semantic controls, keyboard-operable interactions, visible focus and meaningful labels/state communication; do not rely on color alone. Use deterministic accessibility checks when they provide useful evidence, but do not treat them as complete proof.

## Review interpretation

Any code review (DIA audit, Metis evaluator, second reviewer or manual) checks the change against this file. Repo standards override generic preferences where they conflict. Review does not grant push, PR, merge or deploy authority.

## Project-specific additions

_(Each repo adds its own rules here, numbered from 15.)_
