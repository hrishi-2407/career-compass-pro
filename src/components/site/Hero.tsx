import { motion } from "framer-motion";
import { ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteHref } from "@/lib/site-url";

export function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Floating shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full gradient-emerald opacity-20 blur-3xl animate-float" />
        <div
          className="absolute right-0 top-0 h-96 w-96 rounded-full gradient-brand opacity-20 blur-3xl animate-float"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <span className="grid h-4 w-4 place-items-center rounded-full gradient-emerald text-[10px] text-brand-foreground">
              <Star className="h-2.5 w-2.5 fill-current" />
            </span>
            Trusted by 100+ tech professionals across the U.S.
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Helping tech professionals land <span className="text-gradient-brand">high-paying jobs</span> in the USA
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            We optimize your resume, tailor every application, and run a systematic job search across Software
            Engineering, Data, AI/ML, Cloud, SAP, ServiceNow, DevOps, QA, and Cybersecurity — so you focus on
            interviews, not spreadsheets.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={siteHref("#contact")}>
              <Button
                size="lg"
                className="gradient-brand h-12 px-6 text-primary-foreground shadow-elegant hover:opacity-95"
              >
                Book a free consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href={siteHref("#testimonials")}>
              <Button size="lg" variant="outline" className="h-12 px-6 backdrop-blur">
                Read success stories
              </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {["No placement fees", "ATS-engineered resumes", "Daily targeted applications"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand" /> {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-5xl"
        >
          <div className="glass rounded-3xl p-2 shadow-elegant">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { k: "2–3 wks", v: "Avg. time to first interview" },
                  { k: "82%", v: "Candidates receive an offer within 4 months" },
                  { k: "$110K", v: "Average base salary secured" },
                ].map((s) => (
                  <div key={s.v} className="rounded-xl border border-border bg-background/60 p-5">
                    <div className="text-2xl font-bold text-gradient-brand sm:text-3xl">{s.k}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
