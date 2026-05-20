# SecureGate — Reflection & Engineering Analysis
**Name:** [Bamiduro Blessing Opeyemi]
**Cohort:** Design to MVP Bootcamp
**Live URL:** [secure-gate-hazel.vercel.app]
**GitHub Repo:** [Your repo URL]
---
## Part 1 — What I Built
[2–3 sentences describing SecureGate and the specific features you implemented]

## Part 2 — What Surprised Me
[The one thing that was harder than expected, and what you learned from it]

## Part 3 — Engineering Laws Quiz

### Q1 — Murphy's Law
**Code reference:** `app/api/auth/verify/route.ts`
**My Answer:** [One place Murphy’s Law affected SecureGate was the email verification and password reset flow.
I added short expiry times and deleted tokens after use so old or stolen tokens could not be reused. Without this, 
attackers could use expired links to gain access to accounts.]
**What goes wrong if ignored:** [Expired tokens could be reused, and attackers could identify registered emails,
making the authentication system insecure.]

### Q2 — Law of Leaky Abstractions
**Code reference:** `app/api/auth/verify/route.ts`
**My Answer:** [I experienced this with Resend. I initially thought I could send emails to any address immediately, 
but I later realized Resend only allowed emails through my verified sender during development.
I had to read the documentation and understand the email verification system underneath the abstraction to make it work properly.]


### Q3 — YAGNI 
**Code reference:** `app/api/auth/verify/route.ts`
**My Answer:** [Adding social login, multi-factor authentication, or audit logs right now would violate
YAGNI because SecureGate only requires a secure email/password authentication system for this assessment. 
Adding extra features early would increase complexity, introduce more bugs, and slow development without solving the core problem.
If needed later, I would add: social login using NextAuth providers, and audit logs using a separate database table for tracking user actions.]


### Q4 —  Kerckhoffs's Principle
**Code reference:** `bcrypt.hash(parsed.password, 12`
**My Answer:** [A salt is random data added to a password 
before hashing so that users with the same password still have different hashes. 
bcrypt adds this salt automatically and stores it inside the hash. It also uses a 
cost factor to make hashing slower and harder for attackers to brute-force.

If I used SHA-256 instead, passwords would be much easier to crack
because SHA-256 is very fast and vulnerable to rainbow table and brute-force attacks.]


### Q5 —  Postel's Law + Security by Design
**Code reference:** `)`
**My Answer:** []


### Q6 —  The Boy Scout Rule
**Code reference:** `react-email@^0.0.21`
**My Answer:** [I applied the Boy Scout Rule when I found an invalid dependency in my package.json file that was causing npm install errors.
I removed the incorrect package version and replaced it with the correct dependency setup so the project could install and run properly.
This was not part of the original feature work, but cleaning it up improved the stability of the project and prevented future setup issues. ]


### Q7 —  Gall's Law
**Code reference:** `)`
**My Answer:** [SecureGate followed Gall’s Law because I built it step by step instead of building everything at once.
I started with the basic scaffold and database setup, then added authentication, email verification, password reset, and UI improvements gradually.
This made it easier to test each feature and fix problems early before adding more complexity.]


### Q8 —  The Law of Leaky Abstractions 
**Code reference:** `lib/prisma.ts)`
**My Answer:** [One situation where Prisma schema and the actual PostgreSQL database can become different is when a change is made directly 
in the database (like adding a column or constraint) but schema.prisma is not updated.

For example, if a last_login column is added directly in PostgreSQL, Prisma will not know about it until the schema is updated and migrated.]

### Q9 —  Zawinski's Law 
**Code reference:** `)`
**My Answer:** [Principle: Separation of Concerns (Single Responsibility Principle), 
rate limiting is kept as a separate layer instead of being mixed into auth logic.

Zawinski’s Law: Warns that software naturally grows until it tries to do too many things at once.
Without discipline, rate limiting and other features get scattered across the app, leading to bloat, duplication, and hard-to-maintain code.]

### Q10 —  The Principle of Least Surprise 
**Code reference:** `lib/auth-errors.ts)`
**My Answer:** [“Invalid email or password”, It’s intentionally generic so it doesn’t reveal whether the email or password is wrong. 
This prevents attackers from guessing valid accounts, while still being clear enough for users.]


### Q11 —  Murphy's Law + Defensive Programming
**Code reference:** `C:\Users\User\OneDrive\Desktop\SecureGate\src\middleware.ts)`
**My Answer:** [Middleware checks authentication using NextAuth by reading the session from cookies/JWT (auth?.user).
If the session cookie is deleted, authentication fails, so access to /dashboard is blocked and the user is redirected
to /login (both in middleware and again in the page server check as a fallback).]


### Q12 —  Kerckhoffs's Principle + Technical Debt 
**Code reference:** `C:\Users\User\OneDrive\Desktop\SecureGate\src\middleware.ts)`
**My Answer:** [If NEXTAUTH_SECRET is pushed to GitHub, it becomes publicly exposed and can be used to forge or hijack sessions, 
breaking authentication security.To recover: Generate a new NEXTAUTH_SECRET, Update it in all environments (Vercel, server, .env).
Invalidate existing sessions. Remove the secret from Git history and redeploy.]


### Q13 —  Conway's Law 
**Code reference:** `)`
**My Answer:** [Conway’s Law: The structure of a system reflects the way the people (or developer) think and organize communication. 
So a full-stack developer naturally builds folders based on how they mentally separate responsibilities. 
How SecureGate reflects this: app/ → routes & UI (user interaction layer), lib/ → core logic (auth, validation, reusable functions)
Components/ → reusable UI pieces, emails/ → messaging templates), Prisma/ → database structure, middleware.ts → cross-cutting logic like auth and rate limiting]


### Q14 —  Technical Debt
**Code reference:** `)`
**My Answer:** [The rate limiter currently fails open when Upstash env variables are missing, meaning it allows all requests 
instead of limiting them. This is convenient for local development but dangerous in production because misconfiguration could 
expose the system to brute-force attacks.

Fix: Use Upstash when available, otherwise switch to a local in-memory rate limiter, and clearly log when fallback mode is active.]


### Q15 —  Synthesis question
**Code reference:** `)`
**My Answer:** [ Murphy's Law, Leaky Abstractions, YAGNI: Avoid overbuilding, Kerckhoffs's Principle, Boy Scout Rule: Clean up old keys,
tokens, and test credentials. More critical, stale credentials are high-risk for financial systems.]





## Part 4 — One Thing I Would Refactor
[The rate limiter currently fails open when Upstash env variables are missing, meaning it allows all requests 
instead of limiting them. This is convenient for local development but dangerous in production because misconfiguration could 
expose the system to brute-force attacks.

Fix: Use Upstash when available, otherwise switch to a local in-memory rate limiter, and clearly log when fallback mode is active.]


## Part 5 — How This Changes How I Build
[I now design systems with security, structure, and failure cases in mind from the start, not as afterthoughts. 
I separate concerns properly so things like auth, payments, and rate limiting don’t mix with core app logic.]
