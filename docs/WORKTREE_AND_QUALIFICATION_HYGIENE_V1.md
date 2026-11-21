# Atenea — Worktree and Qualification Hygiene v1

Date: 2026-09-15
Status: **SUSTITUIDA el 21-11-2026** por la norma global (`/srv/kairos-lab/AGENTS.md`, «Un worktree por tramo») y por `dia/README.md` paso 8. Los criterios de abajo siguen valiendo, pero el GO de «¿lo subo?» ya autoriza borrar el worktree de ese trabajo; no hace falta un GO aparte.

This policy prevents local worktrees, qualification sandboxes and heavyweight runtime copies from becoming permanent VPS state after their durable value has moved to Git/GitHub and Atenea evidence.

It is a cleanup policy, not standing deletion authority. Detection of a cleanup candidate never authorizes destructive action by itself.

## 1. Principle

Local execution state is temporary unless there is a concrete reason to retain it.

```text
worktree / sandbox exists
→ work executes or qualification produces evidence
→ durable result is reconciled into authoritative Git/GitHub documentation/history
→ verify nothing unique or active remains locally
→ classify CLEANUP_ELIGIBLE
→ remove only under explicit cleanup authorization
```

Do not keep a worktree merely because it once participated in a successful run. Do not delete one merely because its branch looks old.

## 2. Object classes

### Active delivery worktree — KEEP

A worktree is active while any of these is true:

- its issue/WO/PR is still open or execution is in progress;
- a Herdr/Pi/OpenCode/browser/test process still uses it;
- the branch has unique local or remote commits not reconciled into the intended durable destination;
- the worktree is dirty or its state is ambiguous;
- a current demo/pilot/runtime explicitly depends on its path;
- the human has asked to preserve it.

### Merged/published delivery worktree — cleanup candidate

A normal work worktree becomes `CLEANUP_ELIGIBLE` only after all of the following are independently true:

1. intended PR/checkpoint has been accepted and, when applicable, merged;
2. the exact accepted worktree HEAD is reachable from the intended durable remote branch/merge commit, or otherwise explicitly reconciled;
3. `git status --porcelain` is clean;
4. no unique local commit, stash, patch, untracked deliverable or unsaved evidence remains;
5. no active process/session has that worktree as cwd or runtime dependency;
6. no open PR/issue/WO still names the worktree as its execution surface.

The normal removal surface is `git worktree remove <path>`. Branch deletion is a separate action and requires its own safety check and explicit authorization. Never use `rm -rf` as the normal way to remove a registered Git worktree.

### Qualification / experiment sandbox — cleanup candidate after durable evidence

A qualification directory becomes cleanup-eligible when:

1. the experiment has a terminal result (`PASS`, `FAIL`, `ABORTED`, etc.);
2. the result, exact versions, material commands/flags, hashes, failure boundary and conclusions are captured in durable repository evidence;
3. that evidence is published to the authoritative remote, not merely present in an unpublished local branch;
4. no active process uses the sandbox;
5. no unique binary/artifact is still required for a pending reproduction or rollback;
6. any local Git commits that matter are either intentionally disposable fixtures or represented durably elsewhere.

A failed experiment may be deleted just as readily as a successful one once its failure evidence is durable. Retaining gigabytes of copied `node_modules`, package caches or temporary repositories is not a substitute for documentation.

### Historical benchmark corpus — explicit retention decision

Large benchmark directories are not automatically worktrees and may contain unique comparison data. Before deletion, record whether their raw bytes are still required for reproducibility. Prefer durable compact ledgers/results over indefinite full-runtime copies when the benchmark conclusion is already accepted.

### Dirty / ambiguous / detached state — HOLD

Dirty, detached, unregistered or partially reconciled directories are never automatic cleanup targets. First determine whether they contain unique work. A dirty historical checkout is evidence of ambiguity, not permission to reset or delete it.

## 3. Cleanup preflight

For every candidate, record at minimum:

```text
PATH=
TYPE=WORKTREE|QUALIFICATION|BENCHMARK|OTHER
BRANCH_OR_REF=
HEAD=
DIRTY_COUNT=
REMOTE_OR_PR=
MERGED_OR_RECONCILED=
ACTIVE_PROCESS=YES|NO
UNIQUE_LOCAL_STATE=YES|NO|UNKNOWN
DURABLE_EVIDENCE=
SIZE=
CLASSIFICATION=KEEP|HOLD|CLEANUP_ELIGIBLE
```

If any field needed for deletion safety is `UNKNOWN`, classify `HOLD`.

Before deleting a registered worktree, verify it from the owning repository with `git worktree list --porcelain`. Before deleting a qualification sandbox, verify process/session state separately; Git reachability alone is not enough.

## 4. Safe removal boundary

A cleanup action should be small, reviewable and fail closed:

```text
1. freeze exact candidate list;
2. human explicitly authorizes that list;
3. re-check clean/reconciled/no-active-process state immediately before each removal;
4. use native Git worktree removal for registered worktrees;
5. remove qualification directories only after durable evidence is remote-published;
6. run `git worktree prune` only after removals and only for confirmed stale registrations;
7. report reclaimed space and every path actually removed.
```

Do not combine cleanup with implementation, refactoring, documentation cutover or branch-history rewriting. Never force-remove a dirty worktree merely to reclaim space.

## 5. C-084 worktree lifecycle

Two classes must not be conflated:

- **Matt implementer worktrees** are ephemeral task worktrees and should be removed by the Matt workflow after their work is integrated and no unique state remains.
- **Delivery/integration worktrees** carry the PR candidate and normally remain through PR review and accepted merge. PR creation alone is too early to remove them.

The normal delivery cleanup trigger is **post-merge operator closeout**. After the accepted merge is durable, re-check: exact accepted HEAD is reachable from the intended remote/merge commit; tree is clean; no active Herdr/OpenCode/test process uses the path; no unique commit/stash/untracked evidence remains; no open work still names that worktree. Then classify it `CLEANUP_ELIGIBLE` and remove it with `git worktree remove`.

Branch deletion remains a separate decision.

## 6. Branch policy after worktree removal

Removing a worktree does not imply deleting its branch.

A local work branch may be deleted only when its intended remote/PR outcome is fully reconciled and no unique commit remains. Remote branch deletion is a separate publication/destructive boundary and is never implied by local cleanup.

For an open PR, keep the branch and normally keep the worktree if active follow-up is plausible. Once the PR is merged and the exact head is durably reachable, the worktree should normally be cleaned promptly instead of becoming permanent VPS clutter.

## 7. Qualification evidence retention

Durable evidence should preserve the information needed to understand or recreate a result without preserving the whole sandbox:

- runtime/package versions and integrity hashes;
- relevant branch/base/head and fixture identity;
- exact pass/fail boundary;
- material provider flags/bindings behavior without secrets;
- model routes when they were part of the experiment;
- tests/QA and final state;
- why a discarded path was rejected;
- path/name of the sandbox as provenance, even after the directory is later removed.

Never commit credentials, provider auth, patient data or secret-bearing runtime homes as evidence.

## 8. Current VPS hygiene finding — 2026-09-15

The policy was introduced after an inventory found substantial accumulated local state:

```text
/srv/kairos-lab/worktrees      ~3.7 GB
/srv/kairos-lab/qualification  ~221 MB
/srv/kairos-lab/qual           ~2.1 GB
/srv/kairos-lab/benchmarks     ~1.3 GB
```

Most registered Atenea Git worktrees themselves are small; the largest disk use is spread across unrelated/historical worktrees and heavyweight qualification/benchmark runtime copies. Therefore cleanup must be repository-aware rather than a blind `worktrees/` purge.

A read-only 2026-09-15 Atenea inventory is retained outside the repo at `/srv/kairos-lab/qualification/atenea-gp27-cutover-20260915/worktree_inventory.tsv`. It is operational evidence, not permanent source authority.

## 9. Current GP2.7 qualification sandboxes

The GP2.7 sandboxes from `docs/GENTLE_PI_27_HYBRID_NATIVE_ZERO_TOUCH_EVIDENCE_20260915.md` are **not** deletion-eligible until that evidence and the reconciled current Atenea docs are published remotely. After publication and a no-active-process/no-unique-artifact check, they should normally be removed rather than kept indefinitely.

The runtime rollback backup created during machine promotion is different: retain it until the GP2.7 operational cutover has survived normal use and the human explicitly authorizes retiring the rollback copy.

## 10. STOP conditions

Stop cleanup immediately on any of these:

- dirty or unexpected worktree state;
- open/unknown PR or unmerged unique commit;
- active process/session using the path;
- unresolved provenance or evidence dependency;
- a target repo whose owning `.git`/worktree relationship is unclear;
- any need for `--force`, reset, history rewrite or manual deletion of registered Git metadata.

Cleanup is successful when local disposable state disappears **without losing authority, evidence or rollback safety**.
