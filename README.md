# AI QA Automation Agent

> **AI-assisted end-to-end QA automation using Playwright, n8n, Ubuntu, SSH, and Google Gemini.**

[![Playwright](https://img.shields.io/badge/Playwright-1.63.0-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![n8n](https://img.shields.io/badge/n8n-orchestration-EA4B71?logo=n8n&logoColor=white)](https://n8n.io/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

An automation-engineering portfolio project that connects **automated API/UI testing**, **remote Linux execution**, **workflow orchestration**, **AI-assisted failure analysis**, and **automated QA reporting** into one repeatable pipeline.

![AI QA Automation Agent workflow](docs/screenshots/workflow-final.png)

## Why this project

Most QA automation examples stop at writing test cases. This project focuses on the operational workflow around those tests:

- Run a real Playwright suite on a Linux environment.
- Parse the machine-readable results and make a PASS/FAIL decision.
- When failures occur, extract the relevant evidence instead of sending the entire run to the AI.
- Use Gemini to analyze the failure and recommend the next debugging step.
- Generate a human-readable Markdown QA report automatically.

## What it does

```text
                    ┌──────────────────────┐
                    │   Start QA Run       │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Playwright via SSH   │
                    │ Remote Ubuntu runner │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Parse Test Results   │
                    └──────────┬───────────┘
                               ↓
                       ┌───────────────┐
                       │ Tests Passed? │
                       └──────┬────────┘
                         TRUE │ FALSE
                              │
                ┌─────────────┴─────────────┐
                ↓                           ↓
        ┌─────────────────┐       ┌─────────────────────┐
        │ Format PASS     │       │ Extract Failed Tests│
        │ Report          │       └──────────┬──────────┘
        └────────┬────────┘                  ↓
                 │                 ┌─────────────────────┐
                 │                 │ Prepare AI Analysis │
                 │                 └──────────┬──────────┘
                 │                            ↓
                 │                 ┌─────────────────────┐
                 │                 │ Gemini Failure      │
                 │                 │ Analysis             │
                 │                 └──────────┬──────────┘
                 │                            ↓
                 │                 ┌─────────────────────┐
                 │                 │ Format FAIL Report  │
                 │                 └──────────┬──────────┘
                 │                            │
                 └─────────────┬──────────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Build Final QA Report│
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Markdown Report      │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Create Report File   │
                    └──────────────────────┘
```

## Verified results

The workflow was validated with both a normal PASS run and a controlled FAIL run.

| Scenario | Result |
|---|---|
| PASS | **10 passed, 0 failed, 1 skipped** |
| FAIL | **1 controlled failure extracted and analyzed by AI** |
| Output | **Markdown QA report generated** |

### PASS evidence

![Playwright PASS run](docs/screenshots/playwright-pass.png)

Verified report:

```text
Status: PASS
Total Tests: 10
Failed: 0
Skipped: 1
Flaky: 0
Duration: 27.3s
```

### FAIL evidence

The controlled failure is enabled only for demonstration:

```bash
DEMO_FAILURE=1 npm test
```

![Playwright FAIL run](docs/screenshots/playwright-fail.png)

The failing assertion is intentionally deterministic:

```ts
expect(true).toBe(false);
```

The workflow successfully extracted the failure and routed it through AI analysis.

![AI failure analysis](docs/screenshots/n8n-fail-analysis.png)

The AI classification for the demo identified the issue as a **test automation issue** and produced a recommended next debugging step.

## Generated QA reports

### PASS report

![PASS QA report](docs/screenshots/qa-report-pass.png)

### FAIL report

![FAIL QA report](docs/screenshots/qa-report-fail.png)

The final report contains the test-run status and, for failures, the extracted evidence and AI-generated analysis.

## Tech stack

| Layer | Technology |
|---|---|
| Test automation | Playwright 1.63.0 |
| Language | TypeScript |
| Runtime | Node.js 22.x |
| System Under Test | Practice Software Testing |
| Test environment | Ubuntu 24.04.4 LTS |
| Remote execution | SSH |
| Orchestration | n8n |
| AI analysis | Google Gemini |
| Report format | Markdown |
| Test reporters | List, HTML, JSON, JUnit |

## Test coverage

The suite currently covers:

### API

- Authentication success
- Authentication negative case
- Products collection
- Products pagination
- Protected API access
- Protected API negative behavior

### UI

- Homepage loading
- Product search
- Product details
- Add-to-cart behavior

### Controlled failure

- Deterministic failure used to validate the n8n FAIL branch and AI analysis flow.

## Repository structure

```text
ai-qa-automation-agent/
├── README.md
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tests/
│   ├── api/
│   ├── ui/
│   └── demo/
├── workflow/
│   ├── README.md
│   └── ai-qa-automation-agent.json
└── docs/
    ├── architecture.md
    ├── testing.md
    ├── portfolio.md
    ├── GITHUB-PUBLISHING.md
    └── screenshots/
```

Generated runtime output such as `node_modules/`, `reports/`, and `test-results/` is intentionally excluded from Git.

## Getting started

### Prerequisites

- Node.js 22.x
- npm
- Playwright browser dependencies
- Access to the Practice Software Testing SUT
- n8n for the orchestration layer
- Google Gemini credentials for the AI analysis path

### Install dependencies

```bash
npm install
npx playwright install --with-deps chromium
```

### Run the test suite

```bash
npm test
```

### Run the controlled failure demo

```bash
DEMO_FAILURE=1 npm test
```

### Run an individual test

```bash
npx playwright test tests/api/products.spec.ts
```

```bash
npx playwright test tests/ui/product-search.spec.ts
```

## How the n8n workflow handles failures

The remote shell command captures the Playwright exit code and prints the JSON report between explicit markers. The shell then exits successfully so n8n can continue processing the test result.

Sanitized pattern:

```bash
source ~/.nvm/nvm.sh && \
nvm use 22 >/dev/null && \
npm test; \
TEST_EXIT=$?; \
echo "__TEST_EXIT_CODE__=$TEST_EXIT"; \
echo "__TEST_RESULTS_JSON_START__"; \
cat reports/test-results.json; \
echo "__TEST_RESULTS_JSON_END__"; \
exit 0
```

The workflow then applies:

```text
testExitCode = 0
    → PASS branch

testExitCode != 0
    → FAIL branch
```

This design lets the workflow treat a failed test suite as **data to analyze**, rather than allowing the remote command failure to terminate the reporting pipeline.

## AI failure analysis

For failed tests, the workflow extracts evidence such as:

- test title
- test file
- source line
- duration
- error message
- error location
- assertion snippet

Gemini then returns structured fields for:

- What failed
- Likely root cause
- Issue type
- Recommended next debugging step
- Concise QA report

This keeps the AI step focused on the failure evidence collected by the automation layer.

## Controlled failure design

The demo failure test is disabled during normal runs:

```ts
test.skip(
  process.env.DEMO_FAILURE !== '1',
  'Demo failure disabled'
);

expect(true).toBe(false);
```

This allows the same suite to produce:

```text
Normal run
→ 10 passed / 1 skipped

Demo run
→ 10 passed / 1 controlled failure
```

The controlled failure exists specifically to prove that the n8n FAIL branch and AI analysis path work deterministically.

## Security notes

This repository is intended to be safe for public portfolio use.

Do **not** commit:

- API keys
- access tokens
- passwords
- SSH private keys
- webhook secrets
- database credentials
- `.env` files containing secrets

Credentials used by n8n are not documented as plaintext in this repository. When importing the workflow, credentials should be configured in the target n8n instance.

## Current scope

Implemented:

- Playwright API/UI automation
- Remote Ubuntu execution
- n8n orchestration
- PASS/FAIL branching
- Failure extraction
- Gemini-assisted failure analysis
- Structured QA output
- Markdown report generation
- PASS and FAIL validation evidence

Not implemented in this version:

- GitHub Actions CI/CD
- Production notification channels
- WhatsApp integration
- Automatic production deployment

Those are future extensions rather than hidden capabilities of the current project.

## Portfolio value

This project demonstrates practical experience across:

**QA Automation → Linux → SSH → APIs/UI → Workflow Automation → AI → Reporting**

The key engineering outcome is the connected system:

```text
Test execution
    →
Result interpretation
    →
Failure extraction
    →
AI-assisted analysis
    →
Automated QA reporting
```

## Documentation

- [Architecture](docs/architecture.md)
- [Testing evidence](docs/testing.md)
- [Portfolio copy](docs/portfolio.md)
- [GitHub publishing checklist](docs/GITHUB-PUBLISHING.md)

## Author

**Sayudi Putra**

GitHub: [@Sayudi-P](https://github.com/Sayudi-P)

---

> Built as a practical automation-engineering portfolio project to demonstrate how automated testing, workflow orchestration, and AI-assisted diagnostics can work together.
