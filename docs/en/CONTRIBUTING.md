# Contributing Guide

Thank you for your interest in contributing to MenuD Backend! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Environment Setup](#environment-setup)
- [Workflow](#workflow)
- [Conventions](#conventions)
- [Pull Requests](#pull-requests)
- [Issues](#issues)

---

## Code of Conduct

### Our Standards

- Treat all participants respectfully
- Accept constructive feedback
- Focus on what is best for the community
- Show empathy towards other members

### Acceptable Behavior

- Use inclusive and appropriate language
- Respect different viewpoints and experiences
- Accept responsibility for mistakes
- Focus on community impact

---

## How to Contribute

### Types of Contribution

| Type | Description | Difficulty |
|------|-------------|------------|
| Bug Fix | Fix existing bugs | Low-Medium |
| Feature | New functionality | Medium-High |
| Docs | Improve documentation | Low |
| Test | Add or improve tests | Low-Medium |
| Refactor | Restructure existing code | Medium |
| Performance | Optimize performance | Medium-High |
| Security | Fix vulnerabilities | High |

### Contributions Seeking Help

We are looking for help with:

- E2E tests for existing modules
- Documentation of undocumented APIs
- N+1 query optimization
- Internationalization (i18n)
- Accessibility (a11y)

---

## Environment Setup

### Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- npm 9+
- PostgreSQL 14+
- Git 2.30+
- Docker (optional)

### Installation Steps

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/menud-backend.git
cd menud-backend

# 3. Add upstream
git remote add upstream https://github.com/nicolas-pollano/menud-backend.git

# 4. Install dependencies
npm install

# 5. Configure environment variables
cp .env.example .env
# Edit .env with your configurations

# 6. Start database (Docker)
docker run -d \
  --name menud-postgres-dev \
  -e POSTGRES_DB=menud \
  -e POSTGRES_USER=menud_dev \
  -e POSTGRES_PASSWORD=menud_dev123 \
  -p 5432:5432 \
  postgres:14-alpine

# 7. Start server
npm run start:dev
```

### Verify Installation

```bash
# Run tests
npm run test

# Check linter
npm run lint

# Open Swagger
open http://localhost:3500/api-docs
```

---

## Workflow

### 1. Sync with Upstream

```bash
# Fetch upstream
git fetch upstream

# Switch to develop
git checkout develop

# Merge upstream
git merge upstream/develop

# Push to your fork
git push origin develop
```

### 2. Create Feature Branch

```bash
# Create branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/descriptive-name

# Or for bugs
git checkout -b fix/descriptive-name
```

### 3. Make Changes

```bash
# Add files
git add src/module/file.ts

# Commit with descriptive message
git commit -m "feat(module): concise description of change"

# Push to your fork
git push origin feature/descriptive-name
```

### 4. Create Pull Request

1. Go to GitHub and create PR from your branch to `develop`
2. Fill out the PR template
3. Wait for team review

### 5. After Merge

```bash
# Delete local branch
git checkout develop
git pull origin develop
git branch -d feature/descriptive-name

# Delete remote branch
git push origin --delete feature/descriptive-name
```

---

## Conventions

### Code Conventions

#### Naming

| Type | Convention | Example |
|------|------------|---------|
| Files | `kebab-case` | `user.controller.ts` |
| Classes | `PascalCase` | `UserService` |
| Interfaces | `PascalCase` | `IUserService` |
| Variables | `camelCase` | `userId` |
| Functions | `camelCase` | `getUserById` |
| Constants | `SCREAMING_SNAKE` | `MAX_RETRY_COUNT` |
| Enums | `PascalCase` | `UserRole` |
| DTOs | `PascalCase` + `Dto` | `CreateUserDto` |

#### File Structure

```typescript
// user.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```

### Commit Conventions

#### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

#### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add refresh token` |
| `fix` | Bug fix | `fix(orders): calculate total correctly` |
| `docs` | Documentation | `docs(api): update endpoints` |
| `style` | Formatting (no logic change) | `style: fix indentation` |
| `refactor` | Code restructuring | `refactor(user): extract validation` |
| `test` | Tests | `test(auth): add login tests` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `perf` | Performance improvement | `perf(queries): optimize N+1` |
| `ci` | CI/CD | `ci: add GitHub Actions` |
| `build` | Build system | `build: update webpack config` |

#### Examples

```
feat(orders): add real-time notifications via WebSocket

- Implement WebSocket gateway for order updates
- Add notification service
- Update client connection handling

Closes #123
```

```
fix(auth): prevent token reuse after logout

- Add token to blacklist on logout
- Check blacklist in auth guard
- Add cleanup job for expired tokens

Fixes #456
```

### Branch Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/description` | `feature/add-promotions` |
| Bug Fix | `fix/description` | `fix/order-calculation` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |
| Release | `release/version` | `release/v2.1.0` |
| Docs | `docs/description` | `docs/api-guide` |

---

## Pull Requests

### PR Template

```markdown
## Description

[Brief description of changes]

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Documentation update
- [ ] Test update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Security fix

## Main Changes

- [List of main changes]
- [Technical details if necessary]

## Testing

- [ ] Unit tests pass (`npm run test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Linter clean (`npm run lint`)
- [ ] Code coverage doesn't decrease

## Screenshots (if applicable)

[Screenshots of visual changes]

## Related Issues

- Fixes #123
- Closes #456

## Checklist

- [ ] Code follows project conventions
- [ ] No unnecessary console.logs
- [ ] Environment variables documented
- [ ] Swagger updated (if applicable)
- [ ] README updated (if applicable)
```

### PR Rules

1. **Size:** Small, focused PRs (max 500 lines)
2. **Description:** Clear and complete
3. **Tests:** Include tests for new features
4. **Documentation:** Update docs if necessary
5. **Review:** Requires at least 1 approval
6. **CI:** All checks must pass

### Code Review

#### As Reviewer

- Be respectful and constructive
- Focus on the code, not the person
- Offer clear, actionable suggestions
- Thank contributors

#### As Author

- Respond to all comments
- Make requested changes promptly
- Mark threads as resolved
- Thank reviewers

---

## Issues

### Creating Issues

When creating an issue, include:

1. **Clear, descriptive title**
2. **Detailed description** of the problem or feature
3. **Steps to reproduce** (for bugs)
4. **Expected behavior** vs **actual behavior**
5. **Screenshots** (if applicable)
6. **Environment** (OS, Node.js, npm, etc.)

### Issue Types

| Label | Description |
|-------|-------------|
| `bug` | Reported error |
| `enhancement` | Requested new feature |
| `documentation` | Documentation improvement |
| `good first issue` | Good for new contributors |
| `help wanted` | Help needed |
| `question` | Question about the project |
| `wontfix` | Will not be fixed |

---

## Questions?

- **Issues:** [GitHub Issues](https://github.com/nicolas-pollano/menud-backend/issues)
- **Email:** Nicolas Pollano

Thank you for contributing to MenuD Backend!
