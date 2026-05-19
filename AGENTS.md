# AGENTS.md — SecureGate Project Context

## What We Are Building

SecureGate is a standalone, production-ready authentication system built as a focused Next.js application. It is **not** a full product — it is the auth and identity layer, built deeply and correctly. Every decision must reflect security-first thinking.

This is a solo assessment submission for the Dev & Design "Design to MVP Bootcamp." It will be graded on functionality, security depth, code quality, engineering documentation, and live deployment.

---

## Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Use the App Router exclusively. No Pages Router. |
| Language | TypeScript | Strict typing throughout. No `any` unless absolutely justified. |
| Database | PostgreSQL via Prisma ORM | Prisma for all DB access. No raw SQL unless Prisma cannot handle it. |
| Auth | NextAuth.js (Auth.js v5) | Credentials provider. JWT or DB sessions — justify the choice. |
| Password | bcryptjs | Salt rounds must be set to **12**. |
| Email | Resend + React Email | For verification emails and password reset emails. |
| Validation | Zod | All API inputs must be validated server-side with Zod schemas. |
| Rate Limiting | Upstash Redis (`@upstash/ratelimit`) | Applied to login and forgot-password endpoints. |
| Styling | Tailwind CSS | Clean, accessible UI. |
| Deployment | Vercel | Environment variables via Vercel dashboard only. Never hardcoded. |
| Version Control | GitHub | Push early and often. `.env.local` must never be committed. |

---

## Project Structure

Follow this folder structure:

```
securegate/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── verify-email/[token]/
│   │   ├── forgot-password/
│   │   └── reset-password/[token]/
│   ├── dashboard/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   └── layout.tsx
├── components/
│   ├── auth/
│   └── ui/
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client singleton
│   ├── email.ts          # Resend email helpers
│   ├── tokens.ts         # Token generation utilities
│   └── validations.ts    # Zod schemas
├── emails/               # React Email templates
├── prisma/
│   └── schema.prisma
├── middleware.ts          # Route protection + rate limiting
├── next.config.js         # Security headers
├── .env.local             # NEVER commit this
└── REFLECTION.md
```

---

## Prisma Schema

Use exactly these models. Do not alter field names without good reason.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model PasswordResetToken {
  id      String   @id @default(cuid())
  email   String
  token   String   @unique
  expires DateTime
}
```

---

## Environment Variables

These must exist in `.env.local` locally and in the Vercel dashboard for production. Never hardcode any of these values.

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## Build Phases — Do Not Skip Ahead

### Phase 1 — Scaffold & Database
- Bootstrap Next.js 14 with App Router and TypeScript
- Set up Prisma + PostgreSQL connection
- Define all three models (User, VerificationToken, PasswordResetToken)
- Run `prisma migrate dev`
- Push scaffold to GitHub before writing any feature code

### Phase 2 — Authentication Core
- Configure NextAuth with Credentials provider
- Implement `authorize()`: query user by email, compare password with `bcryptjs.compare()`
- Sign Up API route: Zod validation → `bcrypt.hash(password, 12)` → save user
- Protect `/dashboard` using NextAuth middleware
- Confirm passwords in DB are bcrypt hashes (start with `$2b$`)

### Phase 3 — Email Verification
- On sign up: generate token with `crypto.randomBytes(32).toString('hex')`
- Save token + 15-minute expiry to `VerificationToken`
- Send verification email via Resend with token URL
- `/verify-email/[token]`: look up token, check expiry, mark user verified, delete token
- Only verified users can access `/dashboard`

### Phase 4 — Forgot Password
- `/forgot-password` page: email input
- Generate reset token, save with 1-hour expiry to `PasswordResetToken`
- Send reset email via Resend
- `/reset-password/[token]`: validate token, check expiry, accept new password, hash it, save, delete token
- **Always return a success message even if the email does not exist** — do not reveal whether an account exists

### Phase 5 — Rate Limiting & Security Hardening
- Rate limit POST `/api/auth/signin`: max 5 attempts per IP per 10 minutes
- Rate limit `/api/forgot-password` submission
- All error messages must be generic — never confirm email existence, password content, or internal errors
- Add HTTP security headers in `next.config.js`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- Verify all env vars are in Vercel, not hardcoded

### Phase 6 — UI Polish & Deployment
- Accessible forms: real labels, real error messages, loading states
- Password strength indicator on sign up: Weak / Fair / Strong (based on length + character variety)
- Deploy to Vercel, set all env vars in Vercel dashboard
- Confirm `.env.local` is NOT in the GitHub repo
- Test the live URL end-to-end in an incognito window

---

## Security Rules — Non-Negotiable

These rules apply everywhere in the codebase. If you are about to write something that violates one, stop and fix it first.

1. **Never store plain-text passwords.** Always use `bcrypt.hash(password, 12)`.
2. **Never confirm whether an email exists** in forgot-password or any lookup endpoint. Always return a neutral success message.
3. **Never expose internal error details** to the client. Log server-side; return a generic message to the user.
4. **Never commit `.env.local`.** It must be in `.gitignore` from the very first commit.
5. **Never hardcode secrets, API keys, or database URLs** anywhere in the codebase.
6. **Always validate inputs server-side with Zod** — never trust client data.
7. **Always expire tokens.** Verification tokens: 15 minutes. Password reset tokens: 1 hour. Delete tokens after use.
8. **Rate limit sensitive endpoints** — login and forgot-password at minimum.
9. **Sanitise all inputs.** Do not pass raw user input into database queries without Prisma's typed interface.
10. **Do not trust session data without verification.** Middleware must check session on every protected route.

---

## Error Message Standards

| Scenario | What to Show the User |
|---|---|
| Wrong email or password | "Invalid email or password." — never say which one is wrong |
| Email not found (forgot password) | "If an account exists with this email, you will receive a reset link." |
| Token expired | "This link has expired. Please request a new one." |
| Token not found / already used | "This link is invalid or has already been used." |
| Unverified account trying to log in | "Please verify your email before logging in." |
| Rate limit hit | "Too many attempts. Please try again in a few minutes." |
| Generic server error | "Something went wrong. Please try again." |

---

## What NOT to Build

Do not build any of the following — they are out of scope and would violate YAGNI:

- Social login (Google, GitHub, etc.)
- Multi-factor authentication (2FA/TOTP)
- Audit logs
- Admin dashboard
- User roles or permissions
- Payment integration
- Profile editing
- OAuth flows

These features may be architecturally planned for in the REFLECTION.md, but zero code should be written for them.

---

## REFLECTION.md — Required Alongside the App

The `REFLECTION.md` file lives in the root of the repo and is worth **40% of the total grade**. It must answer all 15 engineering law questions. Each answer must include:

1. A plain English explanation
2. A code snippet or file path from the SecureGate repo
3. What goes wrong if this was ignored

The 15 questions cover:
- Q1: Murphy's Law — where did it force extra protection?
- Q2: Leaky Abstractions — where did an abstraction expose the layer beneath?
- Q3: YAGNI — why are social login and 2FA out of scope right now?
- Q4: Kerckhoffs's Principle — what is a salt and why is bcrypt used instead of SHA-256?
- Q5: Security by Design — why does forgot-password return success even when email doesn't exist?
- Q6: Boy Scout Rule — what was cleaned up that wasn't originally planned?
- Q7: Gall's Law — how did building phase by phase reflect this principle?
- Q8: Leaky Abstractions (ORM) — where does Prisma's model differ from the actual DB table?
- Q9: Zawinski's Law — why is rate limiting a separate concern and what happens without discipline?
- Q10: Principle of Least Surprise — what error message is shown on wrong login, and why?
- Q11: Defensive Programming — what happens when a user manually deletes their session cookie?
- Q12: Kerckhoffs + Technical Debt — what happens if `NEXTAUTH_SECRET` is leaked to GitHub?
- Q13: Conway's Law — how does the folder structure reflect how you think?
- Q14: Technical Debt — what is one thing that works now but will cause problems later?
- Q15: Synthesis — how would adding Flutterwave payments apply every principle from this task?

---

## Submission Checklist

Before submitting, verify every item:

- [ ] App is live on Vercel — test in an incognito window from scratch
- [ ] Sign up creates a user with `emailVerified` set after clicking the email link
- [ ] Passwords in DB are bcrypt hashes starting with `$2b$`
- [ ] Verification email sends and the link works
- [ ] Forgot password flow works end-to-end
- [ ] Rate limiting blocks login on attempt 6 (within 10 minutes)
- [ ] `/dashboard` redirects to `/login` when accessed without a session
- [ ] `.env.local` is NOT in the GitHub repo
- [ ] `REFLECTION.md` is in the repo root with all 15 answers
- [ ] No hardcoded API keys or secrets anywhere in the code
- [ ] All environment variables are set in the Vercel dashboard
- [ ] Forms have loading states and real, specific error messages
- [ ] Password strength indicator is working on the sign-up form

---

## Grading Rubric (30 Points Total)

| Area | Max Points |
|---|---|
| App Functionality | 5 |
| Security Depth | 5 |
| Code Quality | 5 |
| Engineering Laws Documentation (REFLECTION.md) | 5 |
| Deployment | 5 |
| Markdown File Quality | 5 |

**27–30:** Distinction — production-ready, principles internalised  
**21–26:** Merit — strong execution, minor gaps  
**15–20:** Pass — built but shallow on reflection or security  
**Below 15:** Resubmit

---

## Agent Guidance

When helping build SecureGate, always:

- **Prioritise security over convenience.** If a shortcut weakens security, do not take it.
- **Ask before adding scope.** Anything not listed in the build phases is out of scope unless explicitly requested.
- **Write TypeScript strictly.** No implicit `any`. Type all function parameters and return values.
- **Use Prisma for all DB access.** Generate migrations with `prisma migrate dev`. Never mutate the DB directly.
- **Validate all inputs server-side with Zod before touching the database.**
- **Keep error messages generic on the client.** Detailed errors go to server logs only.
- **Use `crypto.randomBytes(32).toString('hex')` for all token generation.** Never use `Math.random()`.
- **Never generate the REFLECTION.md.** That file must be written by the student — it is assessed for personal understanding and authenticity.
- **Reference the phase order.** Do not implement Phase 3 features inside Phase 2 files unless there is a clear architectural reason.
- **Suggest commits.** After each phase is stable, remind to push to GitHub.