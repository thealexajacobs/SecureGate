---
trigger: always_on
---

# Security Rules

## Core Principle

Assume every input is malicious.

Build defensively.

---

# Password Security

Always:
- hash passwords with bcryptjs
- use 12 salt rounds
- compare hashes securely

Never:
- store plain passwords
- log passwords
- expose password hints

---

# Token Security

Verification and reset tokens must:
- be cryptographically random
- expire
- be single-use
- be deleted after use

Use:
crypto.randomBytes(32)

---

# Authentication Errors

Never reveal:
- whether email exists
- whether password was correct
- internal auth details

Use generic messages like:
"Invalid credentials"

---

# Route Protection

Protect sensitive routes with:
- NextAuth middleware
- session checks
- verification checks

Never trust client-side auth state.

---

# Rate Limiting

Apply rate limiting to:
- login
- forgot password

Prevent:
- brute force attacks
- abuse
- credential stuffing

---

# Environment Variables

Secrets must exist only in:
- .env.local
- Vercel environment variables

Never:
- commit secrets
- expose keys in frontend code

---

# Input Validation

Validate:
- emails
- passwords
- tokens
- request payloads

Use Zod for validation.

---

# Error Handling

Never expose:
- stack traces
- database errors
- token internals

Log securely server-side only.

---

# Security Headers

Configure:
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

---

# Session Security

Sessions must:
- expire correctly
- redirect safely
- fail securely

Invalid sessions should immediately redirect to login.

---

# Security Philosophy

SecureGate should prioritize:
- predictability
- explicitness
- defensive engineering
- safe defaults

Security is not a feature.
It is infrastructure.