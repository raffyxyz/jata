# GLOSSARY

Domain language for JATA. Architecture reviews and refactors name things from this list.

## Session

**Session** — Proof of identity a caller presents for one request, backed by a Supabase
cookie.

- A session is verified **exactly once per request**, behind the session seam
  (`lib/application/session/`).
- Handlers never see unverified identity: they receive the *caller context*
  (`{ user, supabase }`) handed to them by `withSession`, already verified.
- Two adapters cross the seam: cookie-backed (production) and fixed user (tests).
- Redirecting an unauthenticated *page* visitor to `/login` is middleware's job;
  answering an unauthenticated *route* request with 401 is the session module's job.
  Both are decisions about the same concept — Session — in two execution contexts.
