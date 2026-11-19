# Atenea Coding Standards

This file contains Atenea's stable repo-local horizontal engineering guardrails.

It does **not** define an execution sequence or require one permanent shaping, TDD, delegation or review methodology. Adopted upstream workflows may add task-specific procedures when they are explicitly active; these standards remain in force regardless of method. Machine-decidable rules belong in deterministic repo tooling. If a recurring quality failure can be expressed as a linter, type rule, schema check, test or CI guardrail, prefer that executable guardrail over adding another prose rule here. This file is engineering policy, not a second execution or review lifecycle.

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

Preserve the line endings (CRLF or LF) and encoding of each file you edit. Do not let an editor or formatter normalize a whole file as a side effect of a scoped change.

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

When test-first/TDD is explicitly active, follow the adopted upstream method. Do not infer TDD merely because tests exist, and do not force it for wiring-only, generated, declarative or purely visual changes when it would provide no independent oracle.

Negative and adversarial verification should be proportional to actual risk, especially around authorization, parsing, trust boundaries, migrations, failure/retry behavior, state transitions and destructive operations.

For stateful, temporal, concurrent, cached, tenant-scoped or idempotent behavior, include at least one regression case that would fail a plausible stale-state, wrong-order, cross-scope or repeated-operation implementation when that risk is material. Prefer an executable interleaving/invariant check over prose about the risk.

For a new or materially changed checker, scanner or gate over security, privacy, state, parsing or another trust boundary, prove that the oracle can disagree with the implementation: include at least one known-good case and at least one representative planted violation that must fail. When the invariant applies to shipped/generated runtime behavior, validate the built artifact as well as source where technically relevant. The goal is falsifiability, not ceremonial test volume.

## 8. Fail explicitly when correctness requires knowledge

Do not hide invariant, authority, persistence or safety failures behind silent fallbacks, guessed defaults or "best effort" success.

When correctness depends on knowing, `UNKNOWN` is not `SUCCESS`.

Return or propagate actionable failures. Make retry, idempotency and recovery semantics explicit when operations may repeat or produce persistent side effects.

When correctness depends on ordering, version/generation, ownership or state transitions, make the stale-write/duplicate/out-of-order behavior explicit rather than relying on timing luck or caller discipline.

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

For Atenea, "scalable" means the software can be understood, modified, tested, operated and extended without each change multiplying fragility.

## 12. Validate and canonicalize once at boundaries

Treat user input, files, APIs, tool output, environment values and external protocol payloads as untrusted until they have crossed an explicit validation boundary.

Validate structural and semantic requirements as early as practical, then carry the validated/canonical representation forward. Do not independently rediscover, rematch or renormalize the same durable fact in multiple layers with subtly different rules.

When aliases, names or identifiers may map to one canonical entity, resolve them once. Ambiguous matches must fail explicitly rather than silently selecting the first plausible candidate.

Preserve original identity/provenance when it is needed for diagnostics, audit or round-tripping; canonicalization must not erase evidence required to explain what was received.

## 13. Configuration and environment must be reproducible

Behavior-affecting configuration should be explicit, inspectable and reproducible without copying an opaque machine or home directory.

Prefer secret-free desired-state configuration plus separately supplied credentials over undocumented global mutations, inherited shell variables or ambient defaults.

If runtime behavior materially depends on a profile, feature flag, environment variable or compatibility override, make that dependency discoverable and verifiable before execution.

Temporary configuration overrides must state why they exist, what evidence qualified them and what condition retires them.

Fail visibly when required configuration is stale, incompatible or missing; do not silently fall back to a materially different execution mode.

## 14. User-facing interfaces must remain operable and accessible

When a change affects a user-facing interface, accessibility is part of correctness rather than optional polish.

Prefer semantic controls and native interaction behavior. Preserve keyboard operability, visible focus, meaningful labels, readable error/state communication and layouts that do not require color alone to convey meaning.

Respect user motion/reduced-motion preferences when motion is introduced, and avoid introducing horizontal overflow or interaction traps without a justified product requirement.

Use deterministic accessibility checks where they provide real evidence, but do not treat automated checks as proof of complete accessibility.

## Review interpretation

Any adopted reviewer or engineering skill may consume this file as repository-specific standards.

Repo standards here override generic methodology preferences where they conflict. A tool may report against these standards, but this file does not grant that tool execution, publication or merge authority.
