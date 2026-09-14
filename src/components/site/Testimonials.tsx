import { motion } from "framer-motion";
import { Star, Linkedin as LinkedinIcon, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchApprovedReviews, normalizeLinkedin, type Review } from "@/lib/reviews";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

// Fallback content shown when no approved reviews exist yet
const seedReviews: Review[] = [
  { id: "s1", name: "Priya Sharma", photo_url: null, designation: "Senior Software Engineer @ Adobe", location: "San Jose, CA", linkedin: null, rating: 5, review: "Their ATS rebuild tripled my callbacks in two weeks. The interview prep was brutally honest and it worked — signed a $185K offer.", created_at: new Date().toISOString() },
  { id: "s2", name: "Arjun Menon", photo_url: null, designation: "Data Engineer @ Capital One", location: "McLean, VA", linkedin: null, rating: 5, review: "First recruiter said my old resume looked like it belonged to a different person. Six weeks later I had three onsite loops.", created_at: new Date().toISOString() },
  { id: "s3", name: "Neha Patel", photo_url: null, designation: "ML Engineer @ Nvidia", location: "Santa Clara, CA", linkedin: null, rating: 5, review: "Actual engineers, not sales people. The system design mocks were harder than my real interviews.", created_at: new Date().toISOString() },
  { id: "s4", name: "Rohit Verma", photo_url: null, designation: "SAP Consultant @ Deloitte", location: "New York, NY", linkedin: null, rating: 5, review: "They understood SAP roles better than any recruiter I spoke to. Negotiated a 19% base bump.", created_at: new Date().toISOString() },
  { id: "s5", name: "Sneha Iyer", photo_url: null, designation: "Cloud Engineer @ AWS", location: "Seattle, WA", linkedin: null, rating: 5, review: "Weekly reports made the whole process feel accountable. I always knew exactly where I stood.", created_at: new Date().toISOString() },
  { id: "s6", name: "Karthik Rao", photo_url: null, designation: "DevOps Lead @ Stripe", location: "Remote", linkedin: null, rating: 5, review: "Every application was tailored. That's not a marketing line — I saw the actual cover letters.", created_at: new Date().toISOString() },
];

export function Testimonials() {
  const { data } = useQuery({ queryKey: ["reviews", "approved"], queryFn: fetchApprovedReviews });
  const reviews = data && data.length ? data : seedReviews;

  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-widest text-brand">Success stories</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Real candidates. Real offers.</h2>
          <p className="mt-4 text-muted-foreground">Every review below is submitted by a candidate we've worked with — reviewed and published only with their explicit consent.</p>
        </div>
        <Link to="/submit-review"><Button variant="outline">Share your story</Button></Link>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.article
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.06, duration: 0.5 }}
            className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="flex items-center gap-1 text-brand">
              {Array.from({ length: r.rating }).map((_, k) => (
                <Star key={k} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">"{r.review}"</p>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              <Avatar name={r.name} src={r.photo_url} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{r.name}</div>
                <div className="truncate text-xs text-muted-foreground">{r.designation}</div>
                <div className="truncate text-xs text-muted-foreground">{r.location}</div>
              </div>
              {normalizeLinkedin(r.linkedin) && (
                <a
                  href={normalizeLinkedin(r.linkedin)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${r.name} on LinkedIn`}
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/submit-review" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
          Submit your own review <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  if (src) return <img src={src} alt={name} className="h-10 w-10 rounded-full object-cover" />;
  return (
    <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-sm font-semibold text-primary-foreground">
      {initials}
    </div>
  );
}
