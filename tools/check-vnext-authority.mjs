#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

const read = (rel) => {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    failures.push(`missing current authority surface: ${rel}`);
    return '';
  }
  return fs.readFileSync(p, 'utf8');
};
const req = (rel, token, label) => {
  const body = read(rel);
  if (body && !body.includes(token)) failures.push(`${label} missing in ${rel}`);
};
const forbid = (rel, token, label) => {
  const body = read(rel);
  if (body.includes(token)) failures.push(`${label} forbidden in ${rel}`);
};

// Current authority surfaces must exist. The checker intentionally does not pin
// full policy prose: C-087 checks machine-decidable structure/coherence and lets
// preparation/runtime contracts evolve without forcing duplication into hot-path files.
const required = [
  'README.md', 'AGENTS.md', 'atenea/README.md', 'atenea/AGENTS.md', 'PROTOCOLOS.md', 'CODING_STANDARDS.md', 'CONTEXT.md', 'GLOSSARY.md',
  'docs/START_HERE.md', 'docs/CURRENT_DECISIONS.md',
  'docs/CURRENT_EXECUTION_DECISION_C087.md',
  'docs/CURRENT_EXECUTION_DECISION_C086.md',
  'docs/CURRENT_EXECUTION_DECISION_C085.md',
  'docs/CURRENT_EXECUTION_DECISION_C084.md',
  'docs/EXECUTION_REQUEST_AND_PREFLIGHT_V1.md',
  'docs/PRE_EXECUTION_HARDENING_V1.md',
  'docs/CHILD_AUTHORITY_CAPSULE_V1.md',
  'docs/ATENEA_EXECUTION_ROUTING_V0.md',
  'docs/ATENEA_HARNESS_CONTRACT_V1.md',
  'docs/ATENEA_FREE_PROFILE_V0.md', 'docs/ATENEA_FREE_MODEL_CATALOG_V0.md', 'docs/ATENEA_FREE_VISUAL_UX_ROUTING_V1.md',
  'docs/ATENEA_GO_PROFILE_V0.md', 'docs/ATENEA_GO_MODEL_CATALOG_V0.md',
  'docs/HUMAN_PRODUCT_DESIGN_AUTHORITY_V1.md',
  'docs/ATTENDED_PRODUCT_SHAPING_GUARDRAILS_V1.md',
  'docs/PRODUCT_FIDELITY_GATES_V1.md',
  'docs/PREPUBLICATION_ARTIFACT_VALIDATION_V1.md',
  'docs/PROMOTION_REVIEW_V1.md',
  'docs/C086_REGRESSION_AUDIT_AND_RESTORATION_20261006.md',
  'docs/QUALIFICATION.md', 'docs/NEWCOMER_QUICKSTART_V1.md',
  'docs/WORK_UNIT_COMPOSITION_POLICY_V1.md', 'docs/EXECUTION_EFFICIENCY_LEDGER_V1.md',
  'docs/vnext/CURRENT_COMPATIBILITY.md',
  'tools/opencode-run-telemetry.mjs',
  'opencode.json'
];
for (const rel of required) read(rel);

// Current-decision coherence.
req('atenea/README.md', 'C-087', 'README current decision');
req('AGENTS.md', 'atenea/AGENTS.md', 'root AGENTS routes to the Atenea protocol');
req('atenea/AGENTS.md', 'CURRENT AUTHORITY — C-087', 'AGENTS current authority');
req('docs/START_HERE.md', 'CURRENT FRONT DOOR — C-087', 'front door');
req('docs/EXECUTION_REQUEST_AND_PREFLIGHT_V1.md', 'CURRENT EXECUTION ENTRY CONTRACT — C-087', 'preflight current decision');
req('docs/PRE_EXECUTION_HARDENING_V1.md', 'CURRENT CORA PREPARATION CONTRACT — C-087', 'Cora hardening current decision');
req('docs/CHILD_AUTHORITY_CAPSULE_V1.md', 'CURRENT RUNTIME DISPATCH CONTRACT — C-087', 'child authority current decision');
req('docs/ATENEA_EXECUTION_ROUTING_V0.md', 'CURRENT C-087 ROUTING AUTHORITY', 'routing current decision');
req('docs/ATENEA_HARNESS_CONTRACT_V1.md', 'CURRENT NORMATIVE BOUNDARY — C-087', 'harness current decision');
req('docs/CURRENT_DECISIONS.md', '## C-087 — Harden before launch; capsule authority; observe after run', 'decision ledger');
req('docs/CURRENT_EXECUTION_DECISION_C087.md', 'Harden before launch; capsule authority; observe after run', 'C-087 decision');
req('docs/CURRENT_EXECUTION_DECISION_C087.md', '220k', 'retained context guard');
req('docs/CURRENT_EXECUTION_DECISION_C086.md', 'SUPERSEDED AS CURRENT EXECUTION AUTHORITY BY C-087', 'C-086 supersession marker');
req('docs/CURRENT_EXECUTION_DECISION_C084.md', 'Native OpenCode V2', 'C-084 native-V2 baseline');
req('docs/NEWCOMER_QUICKSTART_V1.md', 'CURRENT QUICKSTART — C-087', 'newcomer quickstart current decision');
req('docs/WORK_UNIT_COMPOSITION_POLICY_V1.md', 'CURRENT CONDITIONAL POLICY — C-087', 'work-unit composition current decision');
req('docs/EXECUTION_EFFICIENCY_LEDGER_V1.md', 'CURRENT OBSERVATIONAL EVIDENCE CONTRACT — C-087', 'efficiency ledger current decision');
req('docs/QUALIFICATION.md', 'CURRENT C-087 QUALIFICATION', 'qualification current decision');
req('docs/ATENEA_FREE_PROFILE_V0.md', 'CURRENT COST-POLICY PROFILE — C-087', 'Free profile current decision');
req('docs/ATENEA_GO_PROFILE_V0.md', 'CURRENT C-087 GO PROFILE', 'Go profile current decision');

// Thin-path structural markers: keep these few and stable; do not checksum prose.
req('atenea/AGENTS.md', 'Do not duplicate Matt', 'upstream method ownership');
req('docs/EXECUTION_REQUEST_AND_PREFLIGHT_V1.md', 'Conditional safeguards:', 'conditional safeguard routing field');
req('docs/EXECUTION_REQUEST_AND_PREFLIGHT_V1.md', 'Delegation to implementation worker', 'delegation contract');
req('docs/PRE_EXECUTION_HARDENING_V1.md', 'deliver Silvia the exact bash + visible agent + prompt', 'human launch boundary');
req('docs/PRE_EXECUTION_HARDENING_V1.md', '## Quality question', 'hardening quality-question section');
req('docs/CHILD_AUTHORITY_CAPSULE_V1.md', 'INCOMPLETE_AUTHORITY', 'fail-closed child authority');
req('docs/CHILD_AUTHORITY_CAPSULE_V1.md', '/srv/.../outbox/...', 'external-path prohibition');
req('tools/opencode-run-telemetry.mjs', 'readOnly: true', 'read-only telemetry DB open');
req('tools/opencode-run-telemetry.mjs', 'max_prompt_context_proxy', 'context proxy telemetry');
forbid('atenea/AGENTS.md', 'PRE_EXECUTION_HARDENING_V1.md', 'Cora-side hardening leaked into runtime policy');
req('docs/START_HERE.md', 'Broad/full suites are not a per-slice default', 'evidence phase ownership');
req('docs/PRODUCT_FIDELITY_GATES_V1.md', 'Invocation and phase ownership', 'conditional fidelity ownership');

// Runtime/project configuration.
const oc = JSON.parse(read('opencode.json') || '{}');
if (oc.default_agent !== 'atenea-volume') failures.push('default OpenCode agent must be atenea-volume');
if (oc.experimental?.subagent_depth !== 2) failures.push('OpenCode experimental.subagent_depth must be 2');
if ('subagent_depth' in oc) failures.push('legacy top-level subagent_depth is forbidden');

const agents = {
  'atenea-volume.md': ['mode: primary', 'model: nan/mimo-v2.6-flash'],
  'atenea-complex.md': ['mode: primary', 'model: nan/glm5.3-flash#high'],
  'atenea-explorer.md': ['mode: subagent', 'model: nan/qwen3.8-flash'],
  'atenea-implementer-volume.md': ['mode: subagent', 'model: nan/deepseek-v4-flash'],
  'atenea-implementer-complex.md': ['mode: subagent', 'model: nan/glm5.3-flash#high'],
  'atenea-merger.md': ['mode: subagent', 'model: nan/mimo-v2.6-flash'],
  'atenea-review-standards.md': ['mode: subagent', 'model: openai/gpt-6-luna#high'],
  'atenea-review-spec-volume.md': ['mode: subagent', 'model: openai/gpt-6-luna#high'],
  'atenea-review-spec-complex.md': ['mode: subagent', 'model: openai/gpt-6.1-sol#high'],
  'atenea-review-visual-standard.md': ['mode: subagent', 'model: openai/gpt-6-luna#high'],
  'atenea-corrector-volume.md': ['mode: subagent', 'model: nan/deepseek-v4-flash'],
  'atenea-corrector-complex.md': ['mode: subagent', 'model: nan/glm5.3-flash#high'],
  'atenea-free.md': ['mode: primary', 'model: opencode/mimo-v2.6-flash-free'],
  'atenea-explorer-free.md': ['mode: subagent', 'model: opencode/mimo-v2.6-flash-free'],
  'atenea-implementer-free.md': ['mode: subagent', 'model: opencode/space-bunny-free'],
  'atenea-implementer-free-complex.md': ['mode: subagent', 'model: opencode/glm-5.3-flash-free'],
  'atenea-merger-free.md': ['mode: subagent', 'model: opencode/mimo-v2.6-flash-free'],
  'atenea-review-standards-free.md': ['mode: subagent', 'model: opencode/deepseek-v4.1-flash-free'],
  'atenea-review-spec-free.md': ['mode: subagent', 'model: opencode/glm-5.3-flash-free'],
  'atenea-review-spec-free-complex.md': ['mode: subagent', 'model: opencode/space-bunny-free'],
  'atenea-review-visual-free.md': ['mode: subagent', 'model: opencode/nemotron-3.5-super-vl-free'],
  'atenea-corrector-free-volume.md': ['mode: subagent', 'model: opencode/glm-5.3-flash-free'],
  'atenea-corrector-free-complex.md': ['mode: subagent', 'model: opencode/deepseek-v4.1-flash-free'],
  'atenea-go.md': ['mode: primary', 'model: opencode-go/deepseek-v4.1-flash'],
  'atenea-explorer-go.md': ['mode: subagent', 'model: nan/mimo-v2.6-flash'],
  'atenea-implementer-go.md': ['mode: subagent', 'model: opencode-go/muse-spark-1.3-contributor'],
  'atenea-merger-go.md': ['mode: subagent', 'model: opencode-go/mimo-v2.6-flash'],
  'atenea-review-standards-go.md': ['mode: subagent', 'model: nan/mimo-v2.6-flash'],
  'atenea-review-spec-go.md': ['mode: subagent', 'model: openai/gpt-6-luna#high'],
  'atenea-corrector-go-volume.md': ['mode: subagent', 'model: opencode-go/deepseek-v4.1-flash'],
  'atenea-corrector-go-complex.md': ['mode: subagent', 'model: opencode-go/deepseek-v4.1-flash']
};
for (const [name, tokens] of Object.entries(agents)) {
  const rel = `.opencode/agents/${name}`;
  for (const token of tokens) req(rel, token, `${name} binding`);
  req(rel, 'permissions:', `${name} native V2 permissions`);
  forbid(rel, '\npermission:', `${name} V1 permission field`);
  forbid(rel, '\nvariant:', `${name} V1 variant field`);
}

// Coordinators are orchestration-only and can dispatch only their declared family.
for (const [coord, subs] of Object.entries({
  'atenea-volume.md': ['atenea-explorer','atenea-implementer-volume','atenea-merger','atenea-review-standards','atenea-review-spec-volume','atenea-review-visual-standard','atenea-corrector-volume'],
  'atenea-complex.md': ['atenea-explorer','atenea-implementer-complex','atenea-merger','atenea-review-standards','atenea-review-spec-complex','atenea-review-visual-standard','atenea-corrector-complex'],
  'atenea-free.md': ['atenea-explorer-free','atenea-implementer-free','atenea-implementer-free-complex','atenea-merger-free','atenea-review-standards-free','atenea-review-spec-free','atenea-review-spec-free-complex','atenea-review-visual-free','atenea-corrector-free-volume','atenea-corrector-free-complex'],
  'atenea-go.md': ['atenea-explorer-go','atenea-implementer-go','atenea-merger-go','atenea-review-standards-go','atenea-review-spec-go','atenea-corrector-go-volume','atenea-corrector-go-complex']
})) {
  req(`.opencode/agents/${coord}`, 'action: edit', `${coord} edit permission declaration`);
  req(`.opencode/agents/${coord}`, 'resource: "*"\n    effect: deny', `${coord} edit denial`);
  for (const sub of subs) req(`.opencode/agents/${coord}`, `resource: "${sub}"`, `${coord} ${sub} dispatch`);
  req(`.opencode/agents/${coord}`, 'INCOMPLETE_AUTHORITY', `${coord} fail-closed authority transport`);
  req(`.opencode/agents/${coord}`, '/outbox', `${coord} external-authority awareness`);
}

// Implementers cannot own lifecycle/review.
for (const name of ['atenea-implementer-volume.md','atenea-implementer-complex.md','atenea-implementer-free.md','atenea-implementer-free-complex.md','atenea-implementer-go.md']) {
  const rel = `.opencode/agents/${name}`;
  req(rel, 'resource: "implement"\n    effect: deny', `${name} /implement denial`);
  req(rel, 'resource: "implement-spec"\n    effect: deny', `${name} /implement-spec denial`);
  req(rel, 'resource: "code-review"\n    effect: deny', `${name} code-review denial`);
  forbid(rel, 'resource: "atenea-review-', `${name} reviewer dispatch`);
  forbid(rel, 'resource: "atenea-corrector-', `${name} corrector dispatch`);
}

// Reviewers remain read-only and repository-local.
for (const name of ['atenea-review-standards.md','atenea-review-spec-volume.md','atenea-review-spec-complex.md','atenea-review-standards-free.md','atenea-review-spec-free.md','atenea-review-spec-free-complex.md','atenea-review-standards-go.md','atenea-review-spec-go.md']) {
  const rel = `.opencode/agents/${name}`;
  req(rel, 'resource: "git diff*"', `${name} diff allowlist`);
  req(rel, 'action: external_directory', `${name} external-directory isolation`);
  req(rel, 'action: subagent', `${name} nested-agent isolation`);
  req(rel, 'INCOMPLETE_AUTHORITY', `${name} fail-closed missing authority`);
}

// Free/Go availability contracts remain fail-closed.
for (const id of ['opencode-go/mimo-v2.6-flash','opencode-go/muse-spark-1.3-contributor','opencode-go/deepseek-v4.1-flash','nan/mimo-v2.6-flash','openai/gpt-6-luna']) {
  req('docs/ATENEA_GO_MODEL_CATALOG_V0.md', id, 'Go model catalog binding');
  req('tools/check-go-models.mjs', `'${id}'`, 'Go runtime model literal');
}
req('tools/check-go-models.mjs', 'ATENEA_GO_MODEL_CHECK=FAIL', 'Go fail-closed marker');
for (const id of ['opencode/mimo-v2.6-flash-free','opencode/space-bunny-free','opencode/deepseek-v4.1-flash-free','opencode/glm-5.3-flash-free']) {
  req('tools/check-free-models.mjs', `'${id}'`, `Free runtime required ID ${id}`);
  req('docs/ATENEA_FREE_MODEL_CATALOG_V0.md', "`" + id + "`", `Free catalog ID ${id}`);
}
req('docs/ATENEA_EXECUTION_ROUTING_V0.md', 'atenea-implementer-free-complex', 'Free Complex writer binding');
req('docs/ATENEA_EXECUTION_ROUTING_V0.md', 'atenea-review-spec-free-complex', 'Free Complex Spec binding');
req('tools/check-free-models.mjs', 'ATENEA_FREE_MODEL_CHECK=FAIL', 'Free fail-closed marker');
req('docs/CURRENT_DECISIONS.md', 'Post-C-087 Free-only Visual/UX conditional evidence', 'Free visual accepted decision ledger');
req('tools/check-free-visual-handoff.mjs', 'validateFreeVisualHandoff', 'Free handoff deterministic classifier');
req('tools/test-free-visual-handoff.mjs', 'ATENEA_FREE_VISUAL_HANDOFF_TEST=PASS', 'Free visual routing proof');

// Free-only UI: read-only conditional third evidence axis, never another Matt review/repair budget.
for (const token of ['action: edit\n    resource: "*"\n    effect: deny','action: shell\n    resource: "*"\n    effect: deny','action: subagent\n    resource: "*"\n    effect: deny','action: external_directory\n    resource: "*"\n    effect: deny','INCOMPLETE_VISUAL_EVIDENCE']) {
  req('.opencode/agents/atenea-review-visual-free.md', token.replaceAll('\\n', '\n'), 'Free Visual/UX review safety');
}
req('.opencode/agents/atenea-free.md', 'UI impact: none|quality|fidelity', 'Free visual dispatch classification');
req('.opencode/agents/atenea-free.md', 'atenea-review-visual-free', 'Free visual conditional dispatch');
req('.opencode/agents/atenea-free.md', 'EXISTING maximum two', 'Free shared correction budget');
req('docs/ATENEA_FREE_VISUAL_UX_ROUTING_V1.md', 'INCOMPLETE_VISUAL_EVIDENCE', 'Free visual missing media fails closed');
// Standard third axis: conditional, read-only and bounded to the same fixed candidate.
for (const token of ['action: edit\n    resource: "*"\n    effect: deny',
                     'action: shell\n    resource: "*"\n    effect: deny',
                     'action: subagent\n    resource: "*"\n    effect: deny',
                     'action: external_directory\n    resource: "*"\n    effect: deny',
                     'INCOMPLETE_VISUAL_EVIDENCE']) {
  req('.opencode/agents/atenea-review-visual-standard.md', token, 'Standard visual read-only');
}
for (const coord of ['atenea-volume.md','atenea-complex.md']) {
  req('.opencode/agents/'+coord, 'atenea-review-visual-standard', 'Standard optional visual delegation');
  req('.opencode/agents/'+coord, 'UI impact: none|quality|fidelity', 'Cora UI classification');
  req('.opencode/agents/'+coord, 'EXISTING maximum two', 'Shared existing correction budget');
}
req('tools/check-standard-visual-handoff.mjs','validateStandardVisualHandoff','Standard deterministic preflight');
req('tools/test-standard-visual-handoff.mjs','ATENEA_STANDARD_VISUAL_HANDOFF_TEST=PASS','Standard route tests');
req('docs/ATENEA_STANDARD_VISUAL_UX_ROUTING_V1.md','INCOMPLETE_VISUAL_EVIDENCE','Standard pixel evidence fail-closed');

req('tools/check-free-models.mjs', "'--visual'", 'visual model preflight conditional option');
req('tools/check-free-models.mjs', "'opencode/nemotron-3.5-super-vl-free'", 'visual model ID');


// V1 execution markers may remain in historical docs, never in current front-door surfaces.
for (const rel of ['README.md','AGENTS.md','atenea/README.md','atenea/AGENTS.md','CONTEXT.md','docs/START_HERE.md','docs/ATENEA_HARNESS_CONTRACT_V1.md','docs/OPERATOR_RUNBOOK_V1.md','docs/vnext/CURRENT_COMPATIBILITY.md']) {
  forbid(rel, 'opencode --pure', 'V1 pure launch as current authority');
}

// Post-C-087 experimental OpenAI profiles: strictly additive and opt-in.
// Structural check only; this is NOT a model-quality or quota qualification.
// Post-PR155 C-087 thin field-recovery amendment: no new lifecycle/models.
req('docs/C087_THIN_WRITER_REVIEW_AND_EVIDENCE_RECOVERY_20261017.md', 'INCOMPLETE_WRITER_RESULT', 'blank child output fails closed');
req('docs/C087_THIN_WRITER_REVIEW_AND_EVIDENCE_RECOVERY_20261017.md', 'SAME fixed SHA', 'reviewer identity');
req('docs/C087_THIN_WRITER_REVIEW_AND_EVIDENCE_RECOVERY_20261017.md', 'concurrently', 'concurrent review when supported');
req('docs/C087_THIN_WRITER_REVIEW_AND_EVIDENCE_RECOVERY_20261017.md', 'before consolidating', 'await all reviewer reports');
req('docs/C087_THIN_WRITER_REVIEW_AND_EVIDENCE_RECOVERY_20261017.md', 'bounded, specifically diagnosed environment repair', 'focal browser environment repair');
req('tools/test-c087-thin-execution-recovery.mjs', 'ATENEA_C087_THIN_RECOVERY_CONTRACT_TEST=PASS', 'C-087 thin field-regression test');
for (const role of ['atenea-free','atenea-volume','atenea-complex','atenea-go','atenea-openai-sprint','atenea-openai-frontier']) {
  req('.opencode/agents/'+role+'.md','INCOMPLETE_WRITER_RESULT','fail-closed coordinator '+role);
  req('.opencode/agents/'+role+'.md','IN THE SAME','same-session coordinator recovery '+role);
}

req('docs/ATENEA_OPENAI_EXPERIMENTAL_PROFILE_V0.md', 'OPERATIVE BY EXPLICIT HUMAN ACTIVATION', 'current OpenAI human activation');
req('docs/ATENEA_OPENAI_EXPERIMENTAL_PROFILE_V0.md', 'legacy identifier only', 'machine-key compatibility without experimental state');
req('docs/CORA_TICKET_TRAIN_PREPARATION_PROMPT_C087.md', 'READY_TO_LAUNCH', 'Cora prompt handoff boundary');
req('docs/CORA_TICKET_TRAIN_PREPARATION_PROMPT_C087.md', 'activación humana', 'OpenAI user authorization in preparation');
req('docs/CORA_TICKET_TRAIN_PREPARATION_PROMPT_C087.md', 'tools/check-experimental-openai-visual-handoff.mjs', 'stable legacy validator entry');

// C-087 preparation ownership: guard against old known-consumer, visual-fixture and routing gaps.
req('docs/PRE_EXECUTION_HARDENING_V1.md', 'shared test helpers', 'known direct test consumers in prelaunch proof');
req('docs/PRE_EXECUTION_HARDENING_V1.md', 'existing usable child-readable capture recipe', 'material visual witness readiness');
req('docs/CORA_TICKET_TRAIN_PREPARATION_PROMPT_C087.md', 'intercalación relevante', 'temporal falsifier retained');
req('docs/EXECUTION_REQUEST_AND_PREFLIGHT_V1.md', 'human-activated atenea-openai-sprint', 'OpenAI operational route not mislabeled experimental');
req('docs/ATENEA_EXECUTION_ROUTING_V0.md', 'Mid-unit human route requests', 'human override requires fixed-boundary reconciliation');
req('docs/C087_THIN_WRITER_REVIEW_AND_EVIDENCE_RECOVERY_20261017.md', 'Incomplete is not unfinished', 'premature visual INCOMPLETE prevented');
req('docs/PREPUBLICATION_ARTIFACT_VALIDATION_V1.md', 'unit-level implementation/visual GO', 'integration separate from unit acceptance');


req('docs/START_HERE.md', 'openai_experimental', 'experimental front door');
req('docs/ATENEA_EXECUTION_ROUTING_V0.md', 'openai_experimental', 'experimental route');

const experimentalPins = {
  'atenea-openai-sprint.md': ['primary', 'nan/mimo-v2.6-flash'],
  'atenea-openai-frontier.md': ['primary', 'nan/mimo-v2.6-flash'],
  'atenea-implementer-openai-sprint.md': ['subagent', 'openai/gpt-6-luna#high'],
  'atenea-implementer-openai-frontier.md': ['subagent', 'openai/gpt-6.1-sol#high'],
  'atenea-review-standards-openai-sprint.md': ['subagent', 'nan/deepseek-v4-flash'],
  'atenea-review-standards-openai-frontier.md': ['subagent', 'nan/glm5.3-flash#high'],
  'atenea-review-spec-openai-sprint.md': ['subagent', 'openai/gpt-6.1-sol#high'],
  'atenea-review-spec-openai-frontier.md': ['subagent', 'openai/gpt-6-luna#high'],
  'atenea-review-visual-openai-sprint.md': ['subagent', 'openai/gpt-6.1-sol#high'],
  'atenea-review-visual-openai-frontier.md': ['subagent', 'openai/gpt-6-luna#high'],
  'atenea-corrector-openai.md': ['subagent', 'openai/gpt-6.1-sol#high']
};
for (const [name, [mode, model]] of Object.entries(experimentalPins)) {
  const rel = `.opencode/agents/` + name;
  const body = read(rel);
  const front = body.match(/^---\n([\s\S]*?)\n---/);
  if (!front) failures.push(`missing native agent frontmatter: ` + name);
  else {
    const lines = front[1].split('\n');
    if (!lines.includes(`mode: ` + mode)) failures.push(`wrong experimental mode: ` + name);
    if (!lines.includes(`model: ` + model)) failures.push(`wrong experimental model: ` + name);
  }
  req(rel, 'permissions:', `native experimental permissions: ` + name);
  forbid(rel, '\nvariant:', `legacy experimental variant: ` + name);
}
const experimentalDispatch = {
  'atenea-openai-sprint.md': ['atenea-explorer', 'atenea-implementer-openai-sprint', 'atenea-merger',
    'atenea-review-standards-openai-sprint', 'atenea-review-spec-openai-sprint', 'atenea-corrector-openai',
    'atenea-review-visual-openai-sprint'],
  'atenea-openai-frontier.md': ['atenea-explorer', 'atenea-implementer-openai-frontier', 'atenea-merger',
    'atenea-review-standards-openai-frontier', 'atenea-review-spec-openai-frontier', 'atenea-corrector-openai',
    'atenea-review-visual-openai-frontier']
};
for (const [name, expected] of Object.entries(experimentalDispatch)) {
  const rel = `.opencode/agents/` + name;
  const body = read(rel);
  const permitted = [...body.matchAll(/- action: subagent\n\s+resource: "([^"]+)"\n\s+effect: allow/g)].map(m => m[1]);
  if (JSON.stringify(permitted.sort()) !== JSON.stringify([...expected].sort()))
    failures.push(`experimental coordinator dispatch allowlist mismatch: ` + name);
  req(rel, 'action: edit\n    resource: "*"\n    effect: deny', 'experimental coordinator edit denial');
  req(rel, 'INCOMPLETE_AUTHORITY', 'experimental coordinator fail-closed');
  req(rel, 'at most two fresh finding-scoped', 'experimental correction bound');
}
// Experimental third evidence axis is conditional, read-only, NOT another Matt reviewer.
for (const name of ['atenea-review-visual-openai-sprint.md','atenea-review-visual-openai-frontier.md']) {
  const rel='.opencode/agents/'+name;
  for (const action of ['edit','shell','subagent','external_directory','webfetch','websearch']) {
    req(rel, '- action: '+action+'\n    resource: "*"\n    effect: deny', 'Experimental Visual reviewer read-only: '+action);
  }
  req(rel, '- action: read\n    resource: "*"\n    effect: allow', 'Experimental Visual reviewer media Read');
  req(rel, 'INCOMPLETE_VISUAL_EVIDENCE', 'Experimental Visual missing media fail closed');
}
for (const coord of ['atenea-openai-sprint.md','atenea-openai-frontier.md']) {
  req('.opencode/agents/'+coord, 'UI impact: none|quality|fidelity', 'Experimental visual classification');
  req('.opencode/agents/'+coord, 'EXISTING maximum two', 'Experimental shared corrections');
  req('.opencode/agents/'+coord, 'human-opted', 'Experimental explicit human opt-in');
}
req('docs/ATENEA_OPENAI_VISUAL_UX_ROUTING_V1.md', 'operative by explicit human activation', 'OpenAI visual human-only boundary');
req('tools/check-experimental-openai-visual-handoff.mjs','validateExperimentalOpenAIVisualHandoff','Experimental deterministic routing');
req('tools/test-experimental-openai-visual-handoff.mjs','ATENEA_OPENAI_EXPERIMENTAL_VISUAL_HANDOFF_TEST=PASS','Experimental route tests');
for (const name of ['atenea-implementer-openai-sprint.md', 'atenea-implementer-openai-frontier.md']) {
  const rel = `.opencode/agents/` + name;
  for (const skill of ['implement', 'implement-spec', 'code-review']) req(rel,
    'resource: "' + skill + '"\n    effect: deny', 'experimental worker lifecycle separation');
  forbid(rel, 'resource: "atenea-review-', 'experimental worker reviewer isolation');
  forbid(rel, 'resource: "atenea-corrector-', 'experimental worker corrector isolation');
}
for (const name of ['atenea-review-standards-openai-sprint.md', 'atenea-review-standards-openai-frontier.md',
  'atenea-review-spec-openai-sprint.md', 'atenea-review-spec-openai-frontier.md']) {
  const rel = `.opencode/agents/` + name;
  req(rel, 'resource: "git diff*"', 'experimental reviewer diff access');
  req(rel, 'INCOMPLETE_AUTHORITY', 'experimental reviewer authority boundary');
  req(rel, 'action: external_directory', 'experimental reviewer directory isolation');
  req(rel, 'action: subagent', 'experimental reviewer subagent isolation');
}

if (failures.length) {
  console.error('ATENEA_VNEXT_AUTHORITY_CHECK=FAIL');
  failures.forEach((x) => console.error(`- ${x}`));
  process.exit(1);
}
console.log('ATENEA_VNEXT_AUTHORITY_CHECK=PASS');
