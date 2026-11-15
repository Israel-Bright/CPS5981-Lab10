# Pipeline run record - Lab 10

| Field | Value |
|---|---|
| Student | Israel Imhomoh |
| GitHub | Israel-Bright |
| Repository | https://github.com/Israel-Bright/CPS5981-Lab10 |
| Pull request (gate blocked) | https://github.com/Israel-Bright/CPS5981-Lab10/pull/1 |
| Gate policy version cited | 1.0.0 |

## Runs

| Run | Run ID | URL | Gate result | What it shows |
|---|---|---|---|---|
| A | 43395418875 | https://github.com/Israel-Bright/CPS5981-Lab10/actions/runs/43395418875 | PASSED · 18 findings · block 0 / warn 18 / record 0 | Starter policy: green on a vulnerable app |
| B | 43580192439 | https://github.com/Israel-Bright/CPS5981-Lab10/actions/runs/43580192439 | PASSED · 7 tests: 3 passed, 4 failed. Failures: cross-student ledger access, GPA code execution, fixed hostile parser inputs, and 300 generated parser inputs. Gate findings: 22 warnings, 0 blocks, 0 records. | My security tests fail; starter policy still passes |
| C | 43583897087 | https://github.com/Israel-Bright/CPS5981-Lab10/actions/runs/43583897087 | BLOCKED · 22 findings: 9 block, 10 warn, 3 record | Policy v1 on a pull request: the gate blocks |
| D | 43651163049 | https://github.com/Israel-Bright/CPS5981-Lab10/actions/runs/43651163049 | PASSED · block 0 / warn 4 / record 3 | After remediation: passes with checks still firing |

Raw evidence for Run D is in `run-output/` and `dast/`. Run C's decision is in `run-output/gate-decision-run-C.md`.

## What Run A's green result proves

Run A’s green result proves that the pipeline completed and the starter gate policy allowed all 18 findings through as warnings. It does not prove that the application is secure, because the policy blocks nothing and the one passing authentication test does not cover every security property.

## Coverage matrix

| Technique | Injection / code exec | Authorization logic | Config & headers | Crash inputs | Known CVEs | Committed secrets |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Secrets · gitleaks |   |   |   |   |   | ✓ |
| SCA · npm audit |   |   |   |   | ✓ |   |
| SAST · Semgrep | ✓ |   |   |   |   |   |
| Security tests · yours | ✓ | ✓ |   | ✓ |   |   |
| DAST · ZAP baseline |   |   | ✓ |   |   |   |
| ShipShield (Station 7) |   |   |   |   |   |   |
| Manual code review of this lab | ✓ | ✓ | ✓ | ✓ |   | ✓ |

**Classes with no ✓ in the completed matrix:** none. This is limited observed coverage, not proof that every defect in each class will be detected. ShipShield reported no technical findings on the remediated state; its blank cells mean coverage was not demonstrated by this scan.

### The gap

Run A’s automated checks produced no findings for authorization logic or crash inputs. Manual inspection of this lab's code identified missing ledger ownership validation and parser operations that could throw on hostile inputs. This row describes inspection of the Lab 10 code, not a claim that the separate Unit 9 assignment was completed.

The added authorization and parser-robustness tests demonstrated these gaps in Run B. Along with the GPA code-execution test, four tests failed while the starter policy still passed. After remediation, Run D passed all seven tests. The completed matrix therefore marks authorization and crash inputs for security tests. The parser tests cover fixed hostile inputs and 300 generated strings; they do not establish resilience against every malformed request, very large input, or resource-exhaustion attack.

## Why Run B was green

The starter gate policy classifies failed security tests as warnings rather than blockers. This decision is written in gate-policy.md and applied by gate/evaluate.js. The policy is version 0.1.0 with its owner still marked UNASSIGNED, so the green result reflects the starter policy rather than proof that the application is secure.

## What remains in Run D, and why it was allowed through

WARN — Cross-Origin-Embedder-Policy missing or invalid: rules.dast.low = warn.
WARN — Cross-Origin-Opener-Policy missing or invalid: rules.dast.low = warn.
WARN — Cross-Origin-Resource-Policy missing or invalid: rules.dast.low = warn.
WARN — Permissions Policy Header Not Set: rules.dast.low = warn.

RECORD — Historical demonstration key:
cbd45dcc5081b2544fe9ac2e69c64fb8a8d38b0d:app/server.js:generic-api-key:13
Allowed by its exact-fingerprint secrets exception.

RECORD — Historical demonstration key:
50b1d01e8cabe03d83b0eea6efb05c8e11791bca:app/app/app/server.js:generic-api-key:13
Allowed by its exact-fingerprint secrets exception.

Both exceptions were approved by Israel Imhomoh and expire on 2026-12-14.

RECORD — Storable and Cacheable Content: rules.dast.informational = record.

Warnings remain visible for review in this isolated localhost lab. Historical demonstration-key findings remain recorded; other secrets still block.

## DAST: two alerts interpreted

The following interpretations use Run D's `dast/zap-baseline.json`, targeting `http://localhost:3000`.

1. **Permissions Policy Header Not Set (10063), Low:** ZAP reported two instances, on `/` and `/search?q=software+assurance`. These responses do not explicitly restrict browser capabilities through a Permissions-Policy header. For this simple advising interface, this is a defense-in-depth configuration gap; the alert does not demonstrate unauthorized camera, microphone, or location access. The policy line `rules.dast.low = "warn"` keeps it visible without blocking this isolated localhost lab. Browser-feature requirements and appropriate restrictions should be reviewed before public deployment.

2. **Storable and Cacheable Content (10049), Informational:** ZAP reported five instances: `/`, `/api/gpa?expr=3.7`, `/api/health`, `/robots.txt`, and `/sitemap.xml`. Their responses lack an explicit caching lifetime, so caching components may apply heuristic caching. The listed instances do not establish that authenticated student ledger data was cached or leaked. For this app, sensitive authenticated responses would need a separate cache-control review. The policy line `rules.dast.informational = "record"` retains this evidence without blocking the lab release.

## ShipShield second opinion

ShipShield scanned the current remediated repository rather than the Run A commit. It reported zero technical security findings, so this scan demonstrated no additional defect-class coverage beyond our pipeline and did not demonstrate coverage of the earlier authorization or crash-input gaps. It separately suggested legal pages, business identity information, and manual privacy/accessibility checks. These suggestions do not demonstrate detection of the lab’s security defects. Because the scans used different code states, this is not a controlled comparison of scanner effectiveness.

> A clean run is not evidence of assurance. It is evidence that these checks did not fire.
