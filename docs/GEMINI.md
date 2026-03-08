# InfinitePush - Project Context & Guidelines

## Project Overview
**InfinitePush** is a SaaS platform designed as a robust, unlimited, and affordable alternative to Ionic Appflow for **Capacitor Live Updates**. It follows a **"Bring Your Own Supabase" (BYOS)** architecture, where clients host their own update files and version history on their Supabase instances, while InfinitePush provides the management dashboard and deployment logic.

### Key Technologies
- **Frontend/Dashboard:** Next.js (deployed on Vercel)
- **Backend/Logic:** Next.js API Routes / Edge Functions
- **Client Storage & DB:** Supabase (Client-owned)
- **Mobile SDK:** Capacitor (wrapping `@capgo/capacitor-updater`)
- **CI/CD:** GitHub Actions
- **Monetization:** Lemon Squeezy (Merchant of Record) with Payoneer for payouts.

---

## Architecture Detail: BYOS (Bring Your Own Supabase)
InfinitePush does NOT host client files. The workflow is:
1. **Dashboard:** Manages projects, authentication, and payment state.
2. **Client Supabase:**
   - **Database:** Stores deployment metadata in `public.infinite_push_deployments`.
   - **Storage:** Stores ZIP bundles in an `infinite-push` bucket.
3. **SDK:** Mobile apps query the InfinitePush central API to check for updates, then download directly from their own Supabase storage.

---

## Project Structure & Key Files
- `INFINITE_PUSH_SAAS.md`: Core product vision, architecture, and technical integration steps (SQL scripts, SDK usage, GitHub Actions).
- `INFINITE_PUSH_MONETIZATION.md`: Financial strategy, payment provider comparisons (Lemon Squeezy, Paddle, Stripe Atlas), and payout workflows for Morocco-based operations.
- `GEMINI.md`: This context file for AI interactions.

---

## Development Status & Roadmap
The project is currently in the **Planning/Inception Phase**. 

### Immediate Next Steps (Phase: Test on K-Syndic)
1. **Schema Setup:** Deploy the `infinite_push_deployments` table to the test client's (K-Syndic) Supabase.
2. **SDK Integration:** Implement the `syncUpdates` logic within the K-Syndic mobile application.
3. **Mocking API:** Simulate the InfinitePush central API using a Supabase Edge Function to validate the end-to-end update flow.
4. **Dashboard Development:** Scaffold the Next.js dashboard on Vercel.

---

## Usage Guidelines for AI
- **Contextual Awareness:** Always remember the **BYOS** constraint; do not suggest architectures where InfinitePush stores binary update files.
- **Monetization Focus:** Reference Lemon Squeezy for payment integrations and webhooks.
- **Tone:** Technical, senior-level, and focused on SaaS scalability and simplicity.
- **Language:** Documentation is in French/English mix; maintain this or adapt as needed for the target audience.
