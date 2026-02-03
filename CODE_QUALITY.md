# Code Quality Suite

This project includes a comprehensive code quality suite that ensures high standards for both Laravel backend and React frontend code.

## 🚀 Quick Start

Run all quality checks at once:
```bash
npm run check-all
```

Or in Docker environment:
```bash
vendor/bin/sail npm run check-all
```

Fix all auto-fixable issues:
```bash
npm run fix-all
```

Or in Docker environment:
```bash
vendor/bin/sail npm run fix-all
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

## � Docker Integration

This project uses Laravel Sail for Docker development. The code quality tools are fully integrated with the Docker environment.

### Docker Setup
- **Vendor Directory**: Properly mounted between host and container for consistent dependencies
- **Node Modules**: Isolated in container to prevent conflicts
- **Autoload**: Optimized autoload files generated in container context

### Running in Docker
All npm scripts work in Docker using `vendor/bin/sail` prefix:
```bash
# Run all checks
vendor/bin/sail npm run check-all

# Run individual tools
vendor/bin/sail npm run phpstan
vendor/bin/sail npm run pint:check
vendor/bin/sail npm run test

# Fix issues
vendor/bin/sail npm run fix-all
```

### Docker Configuration
The `docker-compose.yml` is configured to:
- Mount the entire project directory
- Exclude `node_modules` to prevent conflicts
- Share `vendor` directory for consistent PHP dependencies
- Use proper user permissions for file access

### Troubleshooting Docker Issues
If you encounter PHPStan bootstrap errors:
1. Ensure autoload files are regenerated in container context:
   ```bash
   vendor/bin/sail composer dump-autoload --optimize
   ```
2. Check that vendor directory is properly mounted
3. Restart containers if needed: `vendor/bin/sail down && vendor/bin/sail up -d`

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

### Docker-Specific Issues

**PHPStan bootstrap not found:**
```bash
# Regenerate autoload files in container context
vendor/bin/sail composer dump-autoload --optimize
```

**Permission issues:**
```bash
# Ensure proper user permissions in docker-compose.yml
# Check WWWUSER and WWWGROUP environment variables
```

**Node modules conflicts:**
```bash
# Clear node_modules and reinstall in container
vendor/bin/sail rm -rf node_modules
vendor/bin/sail npm install
```

**Vendor directory issues:**
```bash
# Ensure vendor directory is mounted in docker-compose.yml
# Restart containers after configuration changes
vendor/bin/sail down && vendor/bin/sail up -d
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