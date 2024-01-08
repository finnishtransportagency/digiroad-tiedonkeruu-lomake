# DRTiedonkeruu

## Guides

- [Frontend](frontend/README.md)
- [Backend](serverless/README.md)

<details>
  <summary><strong>Dev environment config files</strong></summary>

### Project

`.vscode/extensions.json`:

- recommends the prettier vscode extension
- recommends the eslint vscode extension

`.vscode/settings.json`:

- sets prettier as vscode default formatter
- makes formatting automatic on save
- makes ESLint's auto-fix run on save
- makes ESLint errors appear as warnings to make it easier to distinguish them from typescript errors
- ensures that the typescript version of the project is used instead of a local installation

### Frontend

`frontend/.eslintignore`:

- defines file matching patterns to ignore when linting

`frontend/.eslintrc.json`:

- defines linting rules and configuration

`frontend/.prettierignore`:

- defines file matching patterns to ignore when formatting

`frontend/.prettierrc.json`:

- defines formatting rules:
  - tabs as indentation
  - no semicolons
  - strings in single quotes
  - single quotes in JSX elements
  - no parentheses around a single argument in an arrow function
  - line width max 100 characters
  - end of line sequence is CRLF

`frontend/tsconfig.json`:

- defines typescript configuration
</details>
