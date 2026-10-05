# AI QA Automation Agent

An AI-assisted QA automation workflow that executes Playwright tests on a remote Ubuntu server, parses test results, detects PASS/FAIL status, analyzes failed tests with Google Gemini, and generates a Markdown QA report.

## Workflow

```text
Start QA Run
    ↓
Run Playwright Tests via SSH
    ↓
Parse Test Results
    ↓
Tests Passed?
   ├── YES → Format PASS Report
   │
   └── NO  → Extract Failed Tests
                ↓
             Prepare AI Analysis
                ↓
             AI Failure Analysis (Gemini)
                ↓
             Format FAIL Report
                ↓
                └──────┐
                       ↓
                Build Final QA Report
                       ↓
                Build Markdown Report
                       ↓
                Create QA Report File
```

## Tech Stack

| Component | Technology |
|---|---|
| Test automation | Playwright 1.63.0 |
| System Under Test | Practice Software Testing |
| Test environment | Ubuntu 24.04.4 LTS |
| Orchestration | n8n |
| Remote execution | SSH |
| AI analysis | Google Gemini |
| Report format | Markdown |
| Runtime | Node.js 22.x |

## Verified PASS Scenario

```text
Status: PASS
Total Tests: 10
Failed: 0
Skipped: 1
Flaky: 0
Duration: 27454.966 ms
```

## Verified FAIL Scenario

A controlled demo failure was enabled with:

```bash
DEMO_FAILURE=1 npm test
```

The workflow detected the non-zero exit code, extracted the failed test, sent its evidence to Gemini, and generated a FAIL Markdown report.

The controlled assertion was:

```ts
expect(true).toBe(false);
```

The resulting analysis identified it as a test automation issue and provided a next debugging step.

## Test Coverage

The current suite includes API and UI tests for authentication, products, pagination, protected endpoints, negative API behavior, homepage loading, product search, product details, and add-to-cart behavior, plus a controlled failure demonstration.

## Architecture

1. Playwright runs API/UI tests on Ubuntu.
2. n8n invokes the tests remotely over SSH.
3. Playwright writes JSON/HTML/JUnit results.
4. n8n parses `reports/test-results.json`.
5. `testExitCode = 0` routes to PASS; non-zero routes to FAIL.
6. FAIL results are extracted and analyzed with Gemini.
7. Both branches produce a final Markdown QA report.

## Repository Structure

```text
ai-qa-automation-agent/
├── README.md
├── package.json
├── playwright.config.ts
├── tests/
│   ├── api/
│   ├── ui/
│   └── demo/
├── reports/
├── workflow/
│   └── n8n-workflow.json
└── docs/
    ├── architecture.md
    ├── testing.md
    ├── portfolio.md
    └── screenshots/
```

## Important Design Decision

The SSH command captures the Playwright exit code, prints it into a marker, prints the JSON report between markers, and returns `0` to the shell so n8n can continue processing the result:

```bash
source ~/.nvm/nvm.sh && nvm use 22 >/dev/null && npm test; TEST_EXIT=$?; echo "__TEST_EXIT_CODE__=$TEST_EXIT"; echo "__TEST_RESULTS_JSON_START__"; cat reports/test-results.json; echo "__TEST_RESULTS_JSON_END__"; exit 0
```

The n8n workflow uses the captured `testExitCode` to decide PASS versus FAIL.

## Current Scope

This version covers Playwright execution, API/UI testing, n8n orchestration, PASS/FAIL branching, AI-assisted failure analysis, and Markdown reporting. GitHub Actions CI/CD is not part of the current implementation.

## Portfolio Story

The main value of this project is the connected workflow: test execution → result interpretation → failure extraction → AI analysis → automated QA reporting.
