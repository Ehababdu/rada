# Code Quality Suite

This project includes a comprehensive code quality suite that ensures high standards for both Laravel backend and React frontend code.

## 🚀 Quick Start

Run all quality checks at once:
```bash
npm run check-all
```

Fix all auto-fixable issues:
```bash
npm run fix-all
```

## 📋 Available Commands

### Frontend (React/TypeScript)
- `npm run lint` - Run ESLint with auto-fix
- `npm run lint:check` - Run ESLint without fixing
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check Prettier formatting
- `npm run types` - Run TypeScript type checking

### Backend (Laravel/PHP)
- `npm run pint` - Run Laravel Pint with auto-fix
- `npm run pint:check` - Run Laravel Pint without fixing
- `npm run phpstan` - Run PHPStan static analysis
- `npm run test` - Run Pest tests
- `npm run test:coverage` - Run tests with coverage report

### Combined Commands
- `npm run check-all` - Run all checks (format → lint → types → pint → phpstan → tests)
- `npm run fix-all` - Fix all auto-fixable issues (format → lint → pint)

## 🔧 Configuration Files

### Frontend
- `.eslintrc.js` - ESLint configuration with React and TypeScript support
- `.prettierrc` - Prettier formatting rules
- `tsconfig.json` - TypeScript configuration with strict mode enabled

### Backend
- `pint.json` - Laravel Pint configuration with Laravel preset
- `phpstan.neon` - PHPStan configuration (level 5)
- `phpunit.xml` - PHPUnit/Pest configuration

## 🎯 Quality Gates

### Pre-commit Hooks
The project uses Husky to run quality checks before commits:
- Automatically runs `npm run check-all` on every commit
- Prevents commits if any checks fail

### CI/CD
GitHub Actions workflow (`.github/workflows/code-quality.yml`) runs on:
- Push to `main` and `develop` branches
- Pull requests to `main` and `develop` branches

## 📊 Check Order

The `check-all` command runs checks in this order:

1. **Prettier** (`format:check`) - Code formatting
2. **ESLint** (`lint:check`) - Code quality and style
3. **TypeScript** (`types`) - Type checking
4. **Laravel Pint** (`pint:check`) - PHP code formatting
5. **PHPStan** (`phpstan`) - PHP static analysis
6. **Pest** (`test`) - Unit and feature tests

## 🛠️ Tool Versions

- **ESLint**: 9.x with React and TypeScript plugins
- **Prettier**: 3.x with Tailwind and import organization plugins
- **TypeScript**: 5.x with strict mode enabled
- **Laravel Pint**: 1.x with Laravel preset
- **PHPStan**: 2.x (Larastan extension)
- **Pest**: 3.x

## 📝 Best Practices

### Frontend
- Use TypeScript with strict mode
- Follow React hooks rules
- Use Prettier for consistent formatting
- Write meaningful component and variable names

### Backend
- Follow Laravel conventions
- Use type hints for all methods
- Write descriptive PHPDoc comments
- Use Pest for testing

### Git Workflow
- Always run `npm run check-all` before pushing
- Fix any failing checks before creating PRs
- Use descriptive commit messages

## 🔍 Troubleshooting

### Common Issues

**ESLint errors:**
```bash
npm run lint  # Auto-fix most issues
```

**TypeScript errors:**
```bash
npm run types  # Check for type errors
```

**PHPStan errors:**
```bash
npm run phpstan  # Run static analysis
```

**Prettier formatting:**
```bash
npm run format  # Format all files
```

### Skipping Checks (Not Recommended)

If you need to commit despite failing checks:
```bash
git commit --no-verify  # Skip pre-commit hooks
```

## 📈 Code Coverage

Generate test coverage report:
```bash
npm run test:coverage
```

Coverage reports are saved in the `coverage/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run check-all` to ensure quality
5. Run `npm run fix-all` to auto-fix issues
6. Commit your changes
7. Push to your fork
8. Create a Pull Request

All checks must pass in CI before merging.