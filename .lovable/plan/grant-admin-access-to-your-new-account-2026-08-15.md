# Grant admin access to your new account

## Confirmed
- Account exists: `kannuadi69@gmail.com`, created Aug 15 05:40 UTC, email already confirmed.
- No admin role assigned yet, so `/admin` currently shows "No admin access".
- Hrishi Bari's review is still stored with status `pending`, waiting for approval.

## Step
Run one database migration that grants the `admin` role to your account:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('b6831125-74c3-4707-9c4d-7e83728bdf1e', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

This is the only safe path, since app-side role writes are locked to the service role by the earlier security fix.

## After it runs
1. Reload `/admin` (sign out and back in if the page was already open).
2. Open the **Reviews → pending** tab and click **Approve** on Hrishi Bari's review.
3. It appears immediately in the public testimonials section on the homepage.

No code changes are needed.
