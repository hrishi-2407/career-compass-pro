
CREATE POLICY "Anyone reads review photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'review-photos');
CREATE POLICY "Anyone uploads review photos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'review-photos');
CREATE POLICY "Admins manage review photos" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'review-photos' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'review-photos' AND public.has_role(auth.uid(), 'admin'));

-- Seed FAQs
INSERT INTO public.faqs (question, answer, sort_order) VALUES
('How does the service work?', 'We start with a free consultation to understand your background and goals, then engineer an ATS-optimized resume, run daily targeted job applications, and coach you through interviews and offer negotiation.', 1),
('Who is eligible?', 'Indian students and experienced tech professionals looking to secure Software Engineering, Data, AI/ML, Cloud, SAP, ServiceNow, DevOps, QA, or Cybersecurity roles in the United States.', 2),
('Do you guarantee jobs?', 'No ethical consultant can guarantee a job. What we guarantee is a systematic, transparent process, honest feedback, and full accountability throughout your search.', 3),
('How long does the process take?', 'On average candidates receive interviews within 3–6 weeks and offers within 8–14 weeks, depending on market conditions, experience, and role type.', 4),
('What makes you different from other job placement services?', 'Technical depth. Our team has hands-on experience across the same stacks our candidates target, so resumes, interview prep, and recruiter conversations reflect what hiring managers actually want.', 5);
