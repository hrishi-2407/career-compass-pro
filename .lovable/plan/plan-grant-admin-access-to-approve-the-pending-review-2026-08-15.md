# Plan: Grant admin access to approve the pending review

## Current state (confirmed)
- The submitted review **is already stored** in the `reviews` table:
  - Name: Hrishi Bari · Rating: 5 · Email: hrishi@gmail.com · Status: `pending` · Submitted Aug 15 05:09 UTC.
- The approval UI already exists at `/admin` (Reviews tab with Approve / Reject / Feature / Delete).
- `auth.users` is currently **empty** — no account exists yet.
- `user_roles` inserts were locked to `service_role` only (earlier security fix), so the `admin` role must be granted via a database migration, not from the app.

## Steps

1. **You sign up** at `/auth` using "Create admin account" mode with your email `kannuadi69@gmail.com` and your chosen password. (Supabase Auth creates the account client-side; your password is never stored or logged anywhere in this project.)
2. **I look up your new user ID** by querying `auth.users` for `kannuadi69@gmail.com`.
3. **I run a database migration** that inserts your user ID into `public.user_roles` with role `admin`:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('<your-user-id>', 'admin')
   ON CONFLICT (user_id, role) DO NOTHING;
   ```
   This uses the `service_role` (bypasses RLS) and is the only safe way to grant admin after the security lockdown.
4. **You sign in** at `/auth` → you're redirected to `/admin`.
5. In the **Reviews → pending** tab, you click **Approve** on Hrishi Bari's review. It then appears on the public website testimonials section.

## Notes
- New sign-ups start **without** admin rights by design — that's the security fix from earlier. Only this one-time migration grant gives you access.
- No code changes are needed; the admin dashboard, review submission, and approval flow are already built and working.
- I will not store your password in memory, code, or any file.
