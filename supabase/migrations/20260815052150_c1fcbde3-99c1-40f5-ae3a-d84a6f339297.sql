ALTER VIEW public.public_reviews SET (security_invoker = true);

CREATE POLICY "Anyone views approved reviews" ON public.reviews
  FOR SELECT TO anon, authenticated
  USING (status = 'approved');

REVOKE ALL ON public.reviews FROM anon;
GRANT SELECT (id, name, photo_url, designation, location, linkedin, rating, review, featured, created_at, status)
  ON public.reviews TO anon;
GRANT INSERT ON public.reviews TO anon;