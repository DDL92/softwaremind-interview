# Softwaremind Playwright Assessment

## Project Overview

This repository contains a Playwright + TypeScript automation framework for the Product Manager assessment application:

`https://softwaremind-assessments.s3.us-east-1.amazonaws.com/login.html`

The framework uses Page Object Model separation, environment-driven configuration, resilient Playwright locators, and CI-ready reporting artifacts.

## Installation

```bash
npm install
```

## Install Browsers

```bash
npx playwright install
```

## Run Tests

```bash
npx playwright test
```

## Run Headed

```bash
npx playwright test --headed
```

## Open Report

```bash
npx playwright show-report
```

## Environment Variables

Create a local `.env` file from `.env.example` when credentials or target URL need to change.

```bash
BASE_URL=https://softwaremind-assessments.s3.us-east-1.amazonaws.com/login.html
VALID_USERNAME=admin
VALID_PASSWORD=admin123
INVALID_USERNAME=wronguser
INVALID_PASSWORD=wrongpassword
```

## Framework Architecture

```text
.
├── pages
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   └── DashboardPage.ts
├── tests
│   ├── registration.spec.ts
│   ├── login.spec.ts
│   └── product-crud.spec.ts
├── utils
│   ├── testData.ts
│   └── randomGenerator.ts
├── .env.example
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

Page classes own locators, page actions, and page-specific assertions. Test files stay focused on business scenarios and follow Arrange-Act-Assert comments for live-coding readability.

## Design Decisions

- Used `getByRole()` and `getByLabel()` as the primary locator strategy.
- Kept CSS locators limited to app elements without accessible names, such as product cards and the custom stock toggle.
- Normalized Playwright `baseURL` to the application origin and kept login navigation explicit with `/login.html`.
- Stored generated registration credentials in `.auth/registered-user.json` so later tests can reuse them when available.
- Used `admin/admin123` as a reliable fallback for independent login and CRUD execution.
- Added product SKU generation inside the CRUD test because the application requires SKU validation even though the assessment data list does not mention it.
- Disabled full parallel execution to keep scenario execution predictable for assessment review.

## Trade-Offs

- The application stores users and products in browser local storage. Because Playwright creates isolated browser contexts per test, registered users are persisted to a local JSON file for reuse across tests, while admin login remains the stable fallback.
- The product list is rendered as cards, not a semantic table. The framework verifies product visibility through the accessible product list region and product headings.
- The stock checkbox has no stable accessible label. A scoped ID locator is used only for that control.

## Future Improvements

- Add authenticated storage state setup for larger suites.
- Add API or local storage fixtures if the app exposes backend endpoints in a future version.
- Expand CRUD coverage to edit, validation errors, search, sorting, pagination, and bulk delete.
- Add a CI workflow that uploads the HTML report, traces, screenshots, and videos as artifacts.
