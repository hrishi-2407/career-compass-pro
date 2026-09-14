-- 1. Private schema for the role-check helper (not exposed to the API)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2. Repoint every policy to private.has_role
DROP POLICY IF EXISTS "Admins delete messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins view messages" ON public.contact_messages;
CREATE POLICY "Admins delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins view messages" ON public.contact_messages FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage faqs" ON public.faqs;
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins view all reviews" ON public.reviews;
CREATE POLICY "Admins delete reviews" ON public.reviews FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update reviews" ON public.reviews FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins view all reviews" ON public.reviews FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage review photos" ON storage.objects;
CREATE POLICY "Admins manage review photos" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'review-photos' AND private.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'review-photos' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 3. No client-side writes to user_roles at all (blocks self-granting admin)
REVOKE ALL ON public.user_roles FROM anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- 4. Stop exposing reviewer emails publicly
DROP POLICY IF EXISTS "Anyone views approved reviews" ON public.reviews;
REVOKE SELECT ON public.reviews FROM anon;

CREATE OR REPLACE VIEW public.public_reviews
WITH (security_invoker = false) AS
  SELECT id, name, photo_url, designation, location, linkedin, rating, review, featured, created_at
  FROM public.reviews
  WHERE status = 'approved';

GRANT SELECT ON public.public_reviews TO anon, authenticated;