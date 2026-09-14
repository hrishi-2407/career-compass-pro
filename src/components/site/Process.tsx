import { motion } from "framer-motion";
import { MessageCircle, FileSearch, Wrench, Send, Users2, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "Consultation",
    body: "Free 30-min call to understand your goals, background, and timeline.",
  },
  {
    icon: FileSearch,
    title: "Resume Assessment",
    body: "Line-by-line technical audit against the roles you're targeting.",
  },
  { icon: Wrench, title: "Resume Engineering", body: "Full rebuild — ATS-optimized, impact-driven, role-specific." },
  {
    icon: Send,
    title: "Daily Applications",
    body: "Targeted submissions every business day with tailored cover letters.",
  },
  { icon: Users2, title: "Recruiter Outreach", body: "Warm outreach to relevant recruiters and hiring managers." },
  { icon: CalendarCheck, title: "Interviews", body: "Scheduling, Follow-Up and Discussion." },
];

export function Process() {
  return (
    <section id="process" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-sm font-semibold uppercase tracking-widest text-brand">How it works</div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A repeatable process, not a promise</h2>
        <p className="mt-4 text-muted-foreground">Six steps we run for every candidate, every week.</p>
      </div>

      <div className="relative mt-16">
        {/* Desktop timeline line */}
        <div className="pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative"
            >
              <div className="relative z-10 mx-auto grid h-12 w-12 place-items-center rounded-full gradient-brand text-primary-foreground shadow-elegant ring-8 ring-background">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-center">
                <div className="text-xs font-semibold text-brand">STEP {i + 1}</div>
                <div className="mt-1 text-base font-semibold">{s.title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
