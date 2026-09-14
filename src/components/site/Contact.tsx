import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
});

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review the form");
      return;
    }
    setLoading(true);
    const newId = crypto.randomUUID();
    const { error } = await supabase.from("contact_messages").insert({
      id: newId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) return toast.error("Couldn't send your message. Try again.");

    setLeadId(`ASC-${newId.slice(0, 8).toUpperCase()}`);
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="text-sm font-semibold uppercase tracking-widest text-brand">Book your free consultation</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Let's talk about your U.S. career.</h2>
          <p className="mt-4 text-muted-foreground">
            Tell us about your background and goals. We'll respond within one business day with a candid assessment and
            next steps — no pressure, no fees for the initial call.
          </p>
          <div className="mt-8 space-y-4">
            {/* Suhas */}
            <div className="rounded-2xl border border-border/60 bg-card/50 p-4 transition-all duration-200 hover:border-brand/30 hover:bg-card hover:shadow-sm">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">Suhas Pawar</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Career Consultant</p>
              </div>

              <div className="space-y-3">
                {/* Email */}
                <a href="mailto:suhas112001@gmail.com" className="group flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-brand text-primary-foreground">
                    <Mail className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground group-hover:text-brand">
                    suhas112001@gmail.com
                  </span>
                </a>

                {/* Phone + WhatsApp */}
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-brand text-primary-foreground">
                    <Phone className="h-4 w-4" />
                  </span>

                  <a href="tel:+919146624409" className="flex-1 text-sm font-medium text-foreground hover:text-brand">
                    +91 91466 24409
                  </a>

                  <a
                    href="https://api.whatsapp.com/send?phone=919146624409&text=Hi%20AscendUS%2C%20I%27d%20like%20to%20know%20more%20about%20your%20career%20consulting%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Hrishibari */}
            <div className="rounded-2xl border border-border/60 bg-card/50 p-4 transition-all duration-200 hover:border-brand/30 hover:bg-card hover:shadow-sm">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">Hrishibari Bari</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Career Consultant</p>
              </div>

              <div className="space-y-3">
                {/* Email */}
                <a href="mailto:hrishibari2002@gmail.com" className="group flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-brand text-primary-foreground">
                    <Mail className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground group-hover:text-brand">
                    hrishibari2002@gmail.com
                  </span>
                </a>

                {/* Phone + WhatsApp */}
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-brand text-primary-foreground">
                    <Phone className="h-4 w-4" />
                  </span>

                  <a href="tel:+917083390189" className="flex-1 text-sm font-medium text-foreground hover:text-brand">
                    +91 70833 90189
                  </a>

                  <a
                    href="https://api.whatsapp.com/send?phone=917083390189&text=Hi%20AscendUS%2C%20I%27d%20like%20to%20know%20more%20about%20your%20career%20consulting%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {leadId ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-elegant">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full gradient-brand text-primary-foreground">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h3 className="mt-6 text-2xl font-bold tracking-tight">Thank you!</h3>
            <p className="mt-3 text-muted-foreground">
              You've taken the first step forward in your career. We'll get back to you soon.
            </p>
            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Your Lead ID</div>
              <div className="mt-1 font-mono text-lg font-semibold">{leadId}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                Keep this reference — our team reviews every lead before reaching out.
              </p>
            </div>
            <Button variant="outline" className="mt-6" onClick={() => setLeadId(null)}>
              Submit another enquiry
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-elegant sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 [&>div]:mt-0">
              <Field label="Full name">
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  maxLength={100}
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  maxLength={255}
                />
              </Field>
            </div>
            <Field label="Phone (optional)">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} />
            </Field>
            <Field label="How can we help?">
              <Textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                maxLength={5000}
                placeholder="Current role, target roles, timeline, visa status..."
              />
            </Field>
            <Button
              type="submit"
              disabled={loading}
              className="mt-6 w-full gradient-brand text-primary-foreground shadow-elegant hover:opacity-95"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  Send message <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">We reply within one business day.</p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 first:mt-0">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
