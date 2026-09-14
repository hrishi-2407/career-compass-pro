import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  ["Resume Quality", "Engineered by senior engineers", "Templated, generic"],
  ["Application Strategy", "Targeted, market-mapped", "Spray & pray"],
  ["Customization", "Per role & company", "Same resume for all"],
  ["ATS Optimization", "Structured for modern ATS", "Rarely tested"],
  ["Transparency", "Weekly reporting dashboard", "Opaque"],
  ["Communication", "Direct Whatsapp + weekly discussion meet", "Sporadic emails"],
  ["Technical Knowledge", "Hands-on engineers", "Non-technical staff"],
  ["Tracking", "Every application logged", "Untracked"],
  ["Professionalism", "White-glove, contract-backed", "Ad-hoc"],
];

export function WhyChoose() {
  return (
    <section className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-brand">Why choose us</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Us vs. typical job consultants</h2>
          <p className="mt-4 text-muted-foreground">See exactly where we're different — no hand-waving.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-brand/40 bg-card p-6 shadow-glow"
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-brand">AscendUS</div>
            <div className="mt-1 text-xl font-bold">Engineered, tracked, accountable</div>
            <ul className="mt-4 space-y-3">
              {rows.map(([k, v]) => (
                <li key={k} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full gradient-emerald text-brand-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  <div>
                    <span className="font-semibold">{k}</span> — <span className="text-muted-foreground">{v}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Typical consultants
            </div>
            <div className="mt-1 text-xl font-bold text-muted-foreground">Templates & guesswork</div>
            <ul className="mt-4 space-y-3">
              {rows.map(([k, , v2]) => (
                <li key={k} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-muted text-muted-foreground">
                    <X className="h-3 w-3" />
                  </span>
                  <div>
                    <span className="font-semibold">{k}</span> — <span className="text-muted-foreground">{v2}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
