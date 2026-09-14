import { Target, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";

const pillars = [
  { icon: Target, title: "Our mission", body: "Move ambitious tech talent into U.S. roles that match their real skills — through engineering, not shortcuts." },
  { icon: Eye, title: "Our vision", body: "Become the most technically credible career partner for Indian engineers building careers in the United States." },
  { icon: Heart, title: "Our values", body: "Transparency in every step, technical honesty in every review, and accountability for every outcome we promise." },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="text-sm font-semibold uppercase tracking-widest text-brand">About us</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Built by engineers who've hired engineers.
          </h2>
          <p className="mt-4 text-muted-foreground">
            AscendUS was started because too many talented Indian engineers were being under-served by
            generic "placement" services — recycled resumes, spray-and-pray applications, and zero
            technical depth. We built a systematic, transparent process instead, run by people who've
            sat on both sides of the interview table across the same stacks our candidates target.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-elegant"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg gradient-emerald text-brand-foreground">
                <p.icon className="h-5 w-5" />
              </span>
              <div className="mt-4 text-lg font-semibold">{p.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
