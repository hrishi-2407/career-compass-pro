import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Star, Upload, CheckCircle2, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { productionSiteUrl } from "@/lib/site-url";

const submitReviewUrl = `${productionSiteUrl}submit-review/`;

export const Route = createFileRoute("/submit-review")({
  component: SubmitReview,
  head: () => ({
    meta: [
      { title: "Share your story — AscendUS" },
      { name: "description", content: "Submit a review of your job-search journey with AscendUS. Published only with your explicit consent." },
      { property: "og:title", content: "Share your story — AscendUS" },
      { property: "og:url", content: submitReviewUrl },
    ],
    links: [{ rel: "canonical", href: submitReviewUrl }],
  }),
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  designation: z.string().trim().min(1).max(150),
  location: z.string().trim().min(1).max(120),
  linkedin: z.string().trim().url().max(255).optional().or(z.literal("")),
  rating: z.number().min(1).max(5),
  review: z.string().trim().min(20).max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required to publish your review" }) }),
});

function SubmitReview() {
  const [rating, setRating] = useState(5);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", designation: "", location: "", linkedin: "", review: "", consent: false });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, rating });
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Please review the form");
    setLoading(true);
    try {
      let photo_url: string | null = null;
      if (file) {
        if (file.size > 5 * 1024 * 1024) throw new Error("Photo must be under 5MB");
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("review-photos").upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("review-photos").getPublicUrl(path);
        photo_url = pub.publicUrl;
      }
      const { error } = await supabase.from("reviews").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        designation: parsed.data.designation,
        location: parsed.data.location,
        linkedin: parsed.data.linkedin || null,
        rating: parsed.data.rating,
        review: parsed.data.review,
        consent: true,
        photo_url,
        status: "pending",
      });
      if (error) throw error;
      setDone(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        {done ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center shadow-elegant">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full gradient-emerald text-brand-foreground">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight">Thank you — review submitted</h1>
            <p className="mt-3 text-muted-foreground">Your review is pending approval. Once our team reviews it, it will appear on the Success Stories section.</p>
            <Link to="/"><Button className="mt-8 gradient-brand text-primary-foreground">Back to home</Button></Link>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <div className="text-sm font-semibold uppercase tracking-widest text-brand">Share your story</div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Tell us how it went</h1>
              <p className="mt-3 text-muted-foreground">Your review will help other candidates. We only publish reviews you explicitly consent to share.</p>
            </div>
            <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-elegant sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
                <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
                <Field label="Current job title"><Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="e.g. Senior SDE @ Google" required /></Field>
                <Field label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Mountain View, CA" required /></Field>
                <Field label="LinkedIn URL (optional)" className="sm:col-span-2"><Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." /></Field>
                <Field label="Photo (optional, max 5MB)" className="sm:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input bg-background p-3 text-sm hover:bg-muted">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{file ? file.name : "Upload your photo"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  </label>
                </Field>
                <Field label="Rating" className="sm:col-span-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star${n>1?"s":""}`}>
                        <Star className={`h-7 w-7 transition-colors ${n <= rating ? "fill-brand text-brand" : "text-muted"}`} />
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Your review" className="sm:col-span-2">
                  <Textarea rows={6} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} required maxLength={2000} placeholder="What was your experience like? What outcomes did you achieve?" />
                </Field>
              </div>
              <label className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <Checkbox checked={form.consent} onCheckedChange={(v) => setForm({ ...form, consent: !!v })} />
                <span className="text-muted-foreground">I consent to AscendUS publishing my name, job title, location, photo, and review on the website.</span>
              </label>
              <Button type="submit" disabled={loading} className="mt-6 w-full gradient-brand text-primary-foreground shadow-elegant">
                {loading ? "Submitting..." : "Submit review"}
              </Button>
            </form>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
