# Development Guidelines

## Conventional Commits

This repository enforces **Conventional Commits** format through a git commit-msg hook.

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries
- **perf**: A code change that improves performance
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

### Scope (optional)
Indicates the module/component affected (e.g., auth, api, ui, database)

### Description Rules
- Use imperative mood ("add" not "added" or "adds")
- Start with lowercase letter
- No period at the end
- Maximum 72 characters for the subject line

### Examples
```bash
feat(auth): add OAuth2 integration
fix(api): resolve null pointer exception in user service
docs: update installation instructions
style(ui): fix button alignment on mobile
refactor(database): extract connection pooling logic
test(auth): add unit tests for login validation
chore(deps): update dependencies to latest versions
perf(search): optimize query performance with indexing
ci(github): add automated testing workflow
build(webpack): update configuration for production
```

### Breaking Changes
For breaking changes, add `BREAKING CHANGE:` in the footer:
```
feat(api): redesign authentication endpoint

BREAKING CHANGE: the authentication endpoint now requires OAuth2 tokens instead of API keys
```

### Commit Template
A commit template is available at `.gitmessage`. Set it up with:
```bash
git config commit.template .gitmessage
```

### Validation
The commit-msg hook will reject commits that don't follow this format. If your commit is rejected, check the error message for specific guidance.

### Bypassing (Not Recommended)
In exceptional cases, you can bypass the hook with:
```bash
git commit --no-verify -m "your message"
```
However, this is strongly discouraged as it defeats the purpose of maintaining consistent commit history.