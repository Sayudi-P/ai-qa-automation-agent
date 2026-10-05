# GitHub Publishing Checklist

## Repository structure

```text
ai-qa-automation-agent/
├── README.md
├── .gitignore
├── package.json
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
    └── screenshots/
        ├── workflow-final.png
        ├── playwright-pass.png
        ├── playwright-fail.png
        ├── n8n-fail-analysis.png
        ├── qa-report-pass.png
        └── qa-report-fail.png
```

## Security review before commit

Do not commit:
- API keys or access tokens
- passwords
- SSH private keys
- webhook secrets
- database connection strings containing credentials

## Git commands

```bash
git add .
git status
git commit -m "feat: add AI QA automation agent"
```

Review `git status` before pushing to GitHub.
