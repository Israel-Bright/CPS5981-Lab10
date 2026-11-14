# Gate decision: BLOCKED

| Item | Value |
|---|---|
| Policy version | 1.0.0 |
| Policy owner | Israel Imhomoh |
| Run ID | 43583897087 |
| Commit | dd974020964539209dc06320ae19c4db053559bb |
| Findings | 22 (block 9, warn 10, record 3) |

| Decision | Source | Level | Finding | Where | Why |
|---|---|---|---|---|---|
| BLOCK | security_tests | fail | REQ-014: student cannot read another student’s ledger | security-tests/ | rule security_tests.fail |
| BLOCK | security_tests | fail | REQ-010: GPA input cannot execute JavaScript | security-tests/ | rule security_tests.fail |
| BLOCK | security_tests | fail | LAB10-ROBUST-01: fixed hostile inputs do not throw | security-tests/ | rule security_tests.fail |
| BLOCK | security_tests | fail | LAB10-ROBUST-01: 300 generated strings do not throw | security-tests/ | rule security_tests.fail |
| BLOCK | sast | WARNING | html-in-template-string | app/server.js:63 | rule sast.WARNING |
| BLOCK | sast | WARNING | eval-detected | app/server.js:69 | rule sast.WARNING |
| BLOCK | sca | high | GHSA-35jh-r3h4-6jhm | lodash <4.17.21 | rule sca.high |
| BLOCK | sca | high | GHSA-p6mc-m468-83gw | lodash >=3.7.0 <4.17.19 | rule sca.high |
| BLOCK | sca | high | GHSA-r5fr-rjxr-66jc | lodash >=4.0.0 <=4.17.23 | rule sca.high |
| WARN | sca | moderate | GHSA-29mw-wpgm-hmr9 | lodash >=4.0.0 <4.17.21 | rule sca.moderate |
| WARN | sca | moderate | GHSA-xxjr-mmjv-4gpg | lodash >=4.0.0 <=4.17.22 | rule sca.moderate |
| WARN | dast | medium | 10038 Content Security Policy (CSP) Header Not Set | 2 instance(s) | rule dast.medium |
| WARN | dast | medium | 10098 Cross-Domain Misconfiguration | 5 instance(s) | rule dast.medium |
| WARN | dast | medium | 10020 Missing Anti-clickjacking Header | 2 instance(s) | rule dast.medium |
| WARN | dast | low | 90004 Cross-Origin-Embedder-Policy Header Missing or Invalid | 2 instance(s) | rule dast.low |
| WARN | dast | low | 90004 Cross-Origin-Opener-Policy Header Missing or Invalid | 2 instance(s) | rule dast.low |
| WARN | dast | low | 10063 Permissions Policy Header Not Set | 2 instance(s) | rule dast.low |
| WARN | dast | low | 10037 Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s) | 5 instance(s) | rule dast.low |
| WARN | dast | low | 10021 X-Content-Type-Options Header Missing | 4 instance(s) | rule dast.low |
| RECORD | secrets | any | cbd45dcc5081b2544fe9ac2e69c64fb8a8d38b0d:app/server.js:generic-api-key:13 | generic-api-key in app/server.js:13 (commit cbd45dc) | exception: This finding identifies the deliberately seeded demonstration key supplied with the lab, not a credential used to access a real service. Retain it as evidence. The exception applies only to this exact historical fingerprint; other detected secrets remain blocked. (approved by Israel Imhomoh, expires 2026-12-14) |
| RECORD | secrets | any | 50b1d01e8cabe03d83b0eea6efb05c8e11791bca:app/app/app/server.js:generic-api-key:13 | generic-api-key in app/app/app/server.js:13 (commit 50b1d01) | exception: This finding identifies the deliberately seeded demonstration key supplied with the lab, not a credential used to access a real service. Retain it as evidence. The exception applies only to this exact historical fingerprint; other detected secrets remain blocked. (approved by Israel Imhomoh, expires 2026-12-14) |
| RECORD | dast | informational | 10049 Storable and Cacheable Content | 5 instance(s) | rule dast.informational |

> A clean run is not evidence of assurance. It is evidence that these checks did not fire.