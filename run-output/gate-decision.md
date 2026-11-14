# Gate decision: PASSED

| Item | Value |
|---|---|
| Policy version | 1.0.0 |
| Policy owner | Israel Imhomoh |
| Run ID | 43651163049 |
| Commit | f710a24d013da354af525a46f2d404606cafecba |
| Findings | 7 (block 0, warn 4, record 3) |

| Decision | Source | Level | Finding | Where | Why |
|---|---|---|---|---|---|
| WARN | dast | low | 90004 Cross-Origin-Embedder-Policy Header Missing or Invalid | 2 instance(s) | rule dast.low |
| WARN | dast | low | 90004 Cross-Origin-Opener-Policy Header Missing or Invalid | 2 instance(s) | rule dast.low |
| WARN | dast | low | 90004 Cross-Origin-Resource-Policy Header Missing or Invalid | 4 instance(s) | rule dast.low |
| WARN | dast | low | 10063 Permissions Policy Header Not Set | 2 instance(s) | rule dast.low |
| RECORD | secrets | any | cbd45dcc5081b2544fe9ac2e69c64fb8a8d38b0d:app/server.js:generic-api-key:13 | generic-api-key in app/server.js:13 (commit cbd45dc) | exception: This finding identifies the deliberately seeded demonstration key supplied with the lab, not a credential used to access a real service. Retain it as evidence. The exception applies only to this exact historical fingerprint; other detected secrets remain blocked. (approved by Israel Imhomoh, expires 2026-12-14) |
| RECORD | secrets | any | 50b1d01e8cabe03d83b0eea6efb05c8e11791bca:app/app/app/server.js:generic-api-key:13 | generic-api-key in app/app/app/server.js:13 (commit 50b1d01) | exception: This finding identifies the deliberately seeded demonstration key supplied with the lab, not a credential used to access a real service. Retain it as evidence. The exception applies only to this exact historical fingerprint; other detected secrets remain blocked. (approved by Israel Imhomoh, expires 2026-12-14) |
| RECORD | dast | informational | 10049 Storable and Cacheable Content | 5 instance(s) | rule dast.informational |

> A clean run is not evidence of assurance. It is evidence that these checks did not fire.