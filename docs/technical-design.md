# Technical Design

## Objective

Build a repeatable QA pipeline where each layer has a clear responsibility:

```text
Playwright → verifies behavior
n8n → orchestrates execution and state
Gemini → diagnoses detected failures
Markdown → preserves a human-readable artifact
```

## System Under Test

- Web: https://practicesoftwaretesting.com/
- API: https://api.practicesoftwaretesting.com/
- API docs: https://api.practicesoftwaretesting.com/api/documentation

Practice Software Testing – Toolshop is a public demo application for software-testing training.

The current public site exposes e-commerce interactions including search, filtering, product details, authentication, and cart behavior. The API documentation exposes User, Product, Invoice, Cart, Category and related resources.

## Execution architecture

```text
Windows / Docker
┌──────────────────────┐
│ n8n                  │
│ orchestration       │
└──────────┬───────────┘
           │ SSH
           ▼
Ubuntu 24.04
┌──────────────────────┐
│ Node.js 22.x         │
│ Playwright 1.63.0    │
└──────────┬───────────┘
           │ HTTPS
           ▼
Practice Software
Testing – Toolshop
```

n8n and browser execution are deliberately separated. This allows orchestration logic to remain independent from the test runtime.

## Playwright configuration

The project uses:

- TypeScript
- headless browser execution
- one worker
- 30-second test timeout
- list reporter
- HTML reporter
- JSON reporter
- JUnit reporter

`API_BASE_URL` can override the API endpoint; the project uses the Practice Software Testing API as its default.

## Test organization

### API

Authentication:

```text
POST /users/login
```

Product data:

```text
GET /products
```

Protected data:

```text
GET /invoices
```

The API suite includes positive and negative authentication/authorization checks as well as product and pagination validation.

### UI

The browser suite covers:

```text
Homepage
   ↓
Product search
   ↓
Product detail
   ↓
Add to cart
```

The API and UI suites complement each other: API checks provide fast feedback on backend/auth behavior, while UI checks validate real browser behavior and rendered application state.

## n8n execution contract

The SSH node emits:

```text
__TEST_EXIT_CODE__=<number>

__TEST_RESULTS_JSON_START__
<Playwright JSON>
__TEST_RESULTS_JSON_END__
```

The shell then exits with code 0.

### Why exit 0?

The failed Playwright run is not treated as an SSH/node failure. Its result must continue through the workflow so n8n can extract and analyze the failure.

The real outcome is preserved in `testExitCode`.

## Result parser

`Parse Test Results` extracts:

```text
testExitCode
summary.expected
summary.unexpected
summary.skipped
summary.flaky
summary.durationMs
testResults
```

The decision node uses:

```text
Field: testExitCode
Type: Number
Operator: equal to
Value: 0
```

## Failure extractor

Playwright JSON can have nested suite structures. `Extract Failed Tests` recursively traverses suites and identifies results with:

```text
status = failed
```

Collected evidence:

```text
test title
file
line / column
duration
error message
stack
snippet
error location
stdout / stderr
```

Only failed-test evidence is passed into the AI step.

## AI diagnostic contract

Gemini receives the failure evidence and is asked to determine:

1. what failed
2. likely root cause
3. issue category
4. recommended next debugging step
5. concise QA report

Issue categories:

```text
application bug
test automation issue
environment / infrastructure issue
data issue
```

## AI boundary

The model is not a release gate.

The sequence is:

```text
Playwright
   ↓
n8n PASS/FAIL gate
   ↓
FAIL
   ↓
Gemini diagnosis
```

This keeps execution truth separate from AI interpretation.

## Report generation

Both branches converge after their branch-specific formatting:

```text
PASS → Format PASS Report ─┐
                           ├→ Final QA Report
FAIL → Format FAIL Report ─┘
                           ↓
                   Build Markdown Report
                           ↓
                   Create QA Report File
```

## Controlled failure

```ts
test.skip(
  process.env.DEMO_FAILURE !== '1',
  'Demo failure disabled'
);

expect(true).toBe(false);
```

Normal run:

```text
10 passed
1 skipped
```

Controlled failure run:

```text
10 passed
1 failed
```

The deterministic failure proves that the n8n FAIL path is able to consume real Playwright failure data and produce AI analysis and a final report.

## Reliability considerations

During validation, a transient browser/session-closed failure was observed in the UI suite and later resolved on targeted/full reruns. This reinforces the distinction between assertion failures and environment/session failures.

The current workflow supports this distinction in the AI issue taxonomy, but it does not automatically retry flaky tests.

## Trade-offs

### One worker

Used for simple, deterministic execution on the small lab host.

Trade-off: lower throughput than parallel execution.

### AI only on FAIL

Reduces noise and keeps the AI focused on evidence that needs diagnosis.

Trade-off: successful runs receive conventional reporting rather than AI commentary.

### Markdown artifact

Portable and human-readable.

Trade-off: not a replacement for a dedicated test-management system.

## Security

Credentials remain in the runtime environment/n8n credential store and are not intended to be committed to Git.

Use the automation only against systems you own or are authorized to test.

## Future extensions

- GitHub Actions / scheduled execution
- Slack/Teams/WhatsApp notifications
- historical trend storage
- test environment provisioning
- ticket creation/routing
- additional accessibility/performance/security test layers
