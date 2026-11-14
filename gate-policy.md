# Gate policy - Cougar Advising

| Field | Value |
|---|---|
| Policy version | 1.0.0 |
| Owner (named person who can defend it) | Israel Imhomoh |
| Last reviewed | 2026-11-14 |
| Override procedure | Israel Imhomoh may approve an exception through a pull request that identifies the exact finding, explains the risk and justification, specifies an expiry date, and records the approval. Exceptions must not disable an entire scanner or rule. Expired exceptions m                  ust be reviewed or removed. |

## Rules

The pipeline reads **only** the JSON block below. `block` fails the build, `warn` passes and is shown in the summary, `record` passes and is written to the decision log only. A level with no rule defaults to `block`.

```json
{
  "policy_version": "1.0.0",
  "owner": "Israel Imhomoh",
  "rules": {
    "security_tests": {
      "fail": "block"
    },
    "secrets": {
      "any": "block"
    },
    "sast": {
      "ERROR": "block",
      "WARNING": "block",
      "INFO": "record"
    },
    "sca": {
      "critical": "block",
      "high": "block",
      "moderate": "warn",
      "low": "warn",
      "info": "record"
    },
    "dast": {
      "high": "block",
      "medium": "warn",
      "low": "warn",
      "informational": "record"
    }
  },
  "exceptions": [
    {
      "source": "secrets",
      "id": "cbd45dcc5081b2544fe9ac2e69c64fb8a8d38b0d:app/server.js:generic-api-key:13",
      "decision": "record",
      "reason": "This finding identifies the deliberately seeded demonstration key supplied with the lab, not a credential used to access a real service. Retain it as evidence. The exception applies only to this exact historical fingerprint; other detected secrets remain blocked.",
      "approved_by": "Israel Imhomoh",
      "expires": "2026-12-14"
    },
    {
      "source": "secrets",
      "id": "50b1d01e8cabe03d83b0eea6efb05c8e11791bca:app/app/app/server.js:generic-api-key:13",
      "decision": "record",
      "reason": "This finding identifies the deliberately seeded demonstration key supplied with the lab, not a credential used to access a real service. Retain it as evidence. The exception applies only to this exact historical fingerprint; other detected secrets remain blocked.",
      "approved_by": "Israel Imhomoh",
      "expires": "2026-12-14"
    }
  ]
}
```

## Why each threshold is where it is

Security tests: Any failure blocks because it demonstrates a violation of a stated security property, such as ledger ownership, safe parsing, or preventing code execution.

Secrets: Findings block by default because exposed credentials can enable unauthorized access. Only the two exact historical fingerprints of the seeded lab demonstration key are excepted.

SAST: ERROR and WARNING findings block pending remediation or a justified exception because this app's findings include executable user input and unsafe HTML output. INFO findings are recorded for review.

SCA: Critical and high vulnerabilities block because of their potential impact. Moderate and low vulnerabilities warn and require review of applicability and remediation options. Informational findings are recorded.

DAST: High findings block. Medium and low findings warn for review in this isolated localhost lab, where browser-header findings require context-specific assessment. Informational findings are recorded. These thresholds must be reassessed before any public deployment.

## Findings that are real but do not block release

Gitleaks detected the deliberately seeded demonstration key in app/server.js and in the earlier nested app/app/app/server.js path. These are actual scanner findings, but the supplied lab key is not used to access a real service. Two separate exceptions record the exact historical fingerprints, approved by Israel Imhomoh and expiring on 2026-12-14. Other secret findings remain blocked. The exceptions preserve the evidence without treating this demonstration value as an active credential.

