# Test Strategy

## Target application

**Practice Software Testing – Toolshop**

Web: https://practicesoftwaretesting.com/

API: https://api.practicesoftwaretesting.com/

The target is a public software-testing training/demo application.

## Coverage matrix

| Area | Scenario | Type |
|---|---|---|
| Authentication | valid login | API positive |
| Authentication | invalid credentials rejected | API negative |
| Products | valid product collection | API |
| Pagination | valid pagination metadata | API |
| Protected API | authenticated invoice access | API positive |
| Protected API | unauthenticated invoice request rejected | API negative |
| Homepage | application loads | UI smoke |
| Search | Hammer search returns relevant products | UI functional |
| Product detail | Hammer details displayed | UI functional |
| Cart | Add Hammer updates cart count | UI functional |
| Failure path | intentional assertion | automation-path validation |

## Acceptance criteria

### PASS

```text
10 passed
1 skipped
0 failed
```

### FAIL

```bash
DEMO_FAILURE=1 npm test
```

Expected workflow behavior:

```text
non-zero test exit code
→ failed test extraction
→ AI analysis
→ FAIL report
```

## Quality gates

```text
Execution gate
→ Playwright

Routing gate
→ n8n

Diagnostic layer
→ Gemini

Artifact layer
→ Markdown
```

Gemini does not replace the execution gate.

## Limitations

The project demonstrates representative API/UI coverage against a public training application. It does not claim complete application coverage.

The current version does not implement CI/CD scheduling, environment provisioning, performance testing, accessibility testing, or automated security scanning.
