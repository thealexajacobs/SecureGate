---
trigger: always_on
---

# Code Style Rules

## General Standards

Code must be:
- readable
- predictable
- maintainable
- minimal
- strongly typed

---

# TypeScript

Always:
- use explicit types
- avoid any
- use shared interfaces
- infer safely when appropriate

---

# Naming

Use:
- PascalCase for components
- camelCase for variables/functions
- UPPER_SNAKE_CASE for constants

Examples:
- LoginForm
- createVerificationToken
- MAX_LOGIN_ATTEMPTS

---

# Functions

Functions should:
- do one thing
- remain small
- be composable

Avoid deeply nested logic.

---

# Components

Components must:
- remain focused
- avoid duplicated logic
- be reusable when reasonable

---

# Comments

Write comments only when:
- explaining intent
- clarifying security logic
- documenting edge cases

Do not comment obvious code.

---

# Async Handling

Always:
- use async/await
- handle failures explicitly
- avoid silent promise failures

---

# Imports

Order:
1. external packages
2. internal aliases
3. relative imports

---

# Validation

Use Zod schemas for:
- forms
- route inputs
- auth payloads

Never manually validate complex payloads inline.

---

# Security-Sensitive Code

Security-related logic must:
- be explicit
- avoid abstraction confusion
- remain easy to audit

Prefer clarity over cleverness.

---

# Styling

Use Tailwind utility classes consistently.

Avoid:
- inline styles
- duplicated utility chains
- inconsistent spacing

---

# Git Standards

Commits should:
- be small
- focused
- descriptive

Example:
feat: add password reset token validation