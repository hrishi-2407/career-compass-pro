import { motion } from "framer-motion";
import {
  FileText,
  Bot,
  Compass,
  Send,
  Users2,
  Linkedin,
  MessageSquare,
  DollarSign,
  ClipboardCheck,
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Resume Optimization",
    body: "Rewritten by engineers to reflect real impact — quantified, targeted, and role-specific.",
  },
  {
    icon: Bot,
    title: "ATS Resume Engineering",
    body: "Structured, keyword-aligned resumes that pass modern ATS pipelines used by Fortune 500 employers.",
  },
  {
    icon: Compass,
    title: "Job Search Strategy",
    body: "A personalized market map: target companies, roles, geographies, and realistic salary bands.",
  },
  {
    icon: Send,
    title: "Daily Job Applications",
    body: "We apply on your behalf every business day with tailored resumes and cover letters.",
  },
  {
    icon: Users2,
    title: "Recruiter Outreach",
    body: "Warm, personalized outreach to relevant recruiters and hiring managers on your behalf.",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Optimization",
    body: "Positioning, headline, About, experience and skills tuned for U.S. tech recruiter searches.",
  },
  // { icon: MessageSquare, title: "Interview Preparation", body: "Technical, behavioral, and system design mock interviews with detailed feedback." },
  // { icon: DollarSign, title: "Salary Negotiation", body: "Data-backed negotiation strategy that consistently lifts offers by 8–22%." },
  // { icon: ClipboardCheck, title: "Offer Evaluation", body: "Compare offers across base, equity, bonus, benefits and long-term career optionality." },
];

export function Services() {
  return (
    <section id="services" className="border-t border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-brand">What we do</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            End-to-end support for your U.S. tech job search
          </h2>
          <p className="mt-4 text-muted-foreground">
            Nine focused services covering every part of the search — from resume to signed offer.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.05, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full gradient-emerald opacity-0 blur-3xl transition-opacity group-hover:opacity-20" />
              <span className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-elegant">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="mt-4 text-base font-semibold">{s.title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
