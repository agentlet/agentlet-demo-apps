#!/usr/bin/env python3
"""
Conventional Commits validator for git commit-msg hook.
Enforces the format: type(scope): description

Allowed types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
"""

import re
import sys
import argparse


class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'


def validate_conventional_commit(commit_message):
    """
    Validates if commit message follows Conventional Commits format.
    
    Format: type(scope): description
    - type: required (feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert)
    - scope: optional, alphanumeric with hyphens/underscores
    - description: required, starts with lowercase, no period at end
    
    Returns: (is_valid, error_message)
    """
    
    # Skip merge commits, revert commits, and fixup commits
    if (commit_message.startswith('Merge ') or 
        commit_message.startswith('Revert ') or 
        commit_message.startswith('fixup!') or
        commit_message.startswith('squash!')):
        return True, None
    
    # Define allowed types
    allowed_types = [
        'feat', 'fix', 'docs', 'style', 'refactor', 'test', 
        'chore', 'perf', 'ci', 'build', 'revert'
    ]
    
    # Conventional commit pattern
    # type(scope): description
    pattern = r'^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\([a-zA-Z0-9_-]+\))?: .+'
    
    if not re.match(pattern, commit_message):
        return False, build_error_message(commit_message, allowed_types)
    
    # Additional validations
    lines = commit_message.split('\n')
    subject = lines[0]
    
    # Check subject length (recommended max 50 chars for git)
    if len(subject) > 72:  # More lenient than 50 for now
        return False, f"Subject line too long ({len(subject)} chars). Keep it under 72 characters."
    
    # Extract description part
    if ':' in subject:
        description = subject.split(':', 1)[1].strip()
        
        # Description should not end with period
        if description.endswith('.'):
            return False, "Description should not end with a period."
        
        # Description should start with lowercase (unless it's a proper noun)
        if description and description[0].isupper() and not is_proper_noun(description):
            return False, "Description should start with lowercase letter (use imperative mood)."
    
    return True, None


def is_proper_noun(text):
    """Check if text starts with common proper nouns that should be capitalized."""
    proper_nouns = ['API', 'URL', 'HTTP', 'HTTPS', 'JSON', 'XML', 'CSS', 'HTML', 'JS', 'SQL', 'DB']
    return any(text.startswith(noun) for noun in proper_nouns)


def build_error_message(commit_message, allowed_types):
    """Build a helpful error message with examples."""
    error_msg = f"""{Colors.RED}{Colors.BOLD}✗ Invalid commit message format{Colors.END}

{Colors.YELLOW}Your commit message:{Colors.END}
{Colors.RED}"{commit_message}"{Colors.END}

{Colors.YELLOW}Expected format:{Colors.END}
{Colors.GREEN}type(scope): description{Colors.END}

{Colors.YELLOW}Where:{Colors.END}
• {Colors.CYAN}type{Colors.END}: one of {', '.join(allowed_types)}
• {Colors.CYAN}scope{Colors.END}: optional, indicates module/component (e.g., auth, api, ui)
• {Colors.CYAN}description{Colors.END}: brief description in imperative mood, lowercase start, no period

{Colors.YELLOW}Valid examples:{Colors.END}
{Colors.GREEN}feat(auth): add OAuth2 integration{Colors.END}
{Colors.GREEN}fix(api): resolve null pointer exception{Colors.END}
{Colors.GREEN}docs: update installation instructions{Colors.END}
{Colors.GREEN}style(ui): fix button alignment on mobile{Colors.END}
{Colors.GREEN}refactor: extract database connection logic{Colors.END}
{Colors.GREEN}test(auth): add unit tests for login{Colors.END}
{Colors.GREEN}chore(deps): update dependencies{Colors.END}

{Colors.YELLOW}Tip:{Colors.END} Use 'git config commit.template .gitmessage' to set a commit template.
"""
    return error_msg


def main():
    parser = argparse.ArgumentParser(description='Validate Conventional Commits format')
    parser.add_argument('commit_msg_file', nargs='?', help='Path to commit message file')
    parser.add_argument('--message', '-m', help='Commit message to validate directly')
    
    args = parser.parse_args()
    
    if args.message:
        commit_message = args.message
    elif args.commit_msg_file:
        try:
            with open(args.commit_msg_file, 'r', encoding='utf-8') as f:
                commit_message = f.read().strip()
        except FileNotFoundError:
            print(f"{Colors.RED}Error: Could not read commit message file: {args.commit_msg_file}{Colors.END}")
            sys.exit(1)
    else:
        print(f"{Colors.RED}Error: No commit message provided{Colors.END}")
        sys.exit(1)
    
    # Skip empty messages
    if not commit_message.strip():
        print(f"{Colors.RED}Error: Empty commit message{Colors.END}")
        sys.exit(1)
    
    # Validate the commit message
    is_valid, error_message = validate_conventional_commit(commit_message)
    
    if is_valid:
        print(f"{Colors.GREEN}✓ Commit message follows Conventional Commits format{Colors.END}")
        sys.exit(0)
    else:
        print(error_message)
        sys.exit(1)


if __name__ == '__main__':
    main()