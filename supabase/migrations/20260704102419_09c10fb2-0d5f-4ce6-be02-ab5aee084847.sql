
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "Anyone can send a message" ON public.contact_messages;
CREATE POLICY "Anyone can send a message" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(name) BETWEEN 1 AND 100 AND length(email) BETWEEN 3 AND 255 AND length(message) BETWEEN 1 AND 5000);
