---
trigger: always_on
---

# Architecture Rules

## Application Architecture

Use feature-oriented modular architecture.

Authentication systems must remain:
- isolated
- predictable
- maintainable
- testable

---

# Folder Rules

## app/

Contains:
- routes
- pages
- route handlers

Do NOT place business logic here.

---

## lib/

Contains:
- auth logic
- token utilities
- prisma client
- mail helpers
- rate limiting
- validations

All reusable business logic belongs here.

---

## components/

Reusable UI components only.

Avoid:
- business logic
- direct database access
- auth mutations

---

## emails/

Contains:
- React Email templates
- verification email
- password reset email

---

# Route Protection

Protect:
- dashboard routes
- sensitive endpoints
- authenticated actions

Protection must happen:
- server-side
- middleware level

Never rely only on client redirects.

---

# Validation Strategy

Validation flow:

Client → Zod Schema → Route Handler → Database

All critical validation must happen server-side.

---

# Token Architecture

Use separate token systems for:
- email verification
- password reset

Each token must:
- expire
- be unique
- be deleted after use

---

# Session Architecture

Use NextAuth session handling.

Sessions must:
- expire safely
- redirect correctly
- fail safely

---

# Error Handling

All errors must:
- be generic to users
- be specific in logs
- never leak internal state

---

# API Design

Keep route handlers thin.

Example:
- validate input
- call service function
- return response

Avoid large route files.