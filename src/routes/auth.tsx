import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft } from "lucide-react";
import { siteHref } from "@/lib/site-url";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [{ title: "Admin sign in — AscendUS" }],
  }),
});

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(200),
});

function AuthPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) nav({ to: "/admin" });
    });
  }, [nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = schema.safeParse(form);

    if (!parsed.success) {
      return toast.error("Enter a valid email and password (6+ chars)");
    }

    setLoading(true);

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword(parsed.data)
        : await supabase.auth.signUp({
            ...parsed.data,
            options: {
              emailRedirectTo: new URL(siteHref("admin/"), window.location.origin).toString(),
            },
          });

    setLoading(false);

    if (error) return toast.error(error.message);

    toast.success(mode === "signin" ? "Signed in" : "Account created");
    nav({ to: "/admin" });
  }

  return (
    <div className="grid min-h-screen place-items-center gradient-hero px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            AscendUS admin
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Sign in" : "Create admin account"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Access the review moderation dashboard.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="text-xs">Password</Label>
              <Input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-brand text-primary-foreground"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>

          <button
            onClick={() =>
              setMode(mode === "signin" ? "signup" : "signin")
            }
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin"
              ? "First time? Create an admin account"
              : "Already have an account? Sign in"}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            New accounts start without admin role. See the dashboard for how
            to grant it.
          </p>
        </div>
      </div>
    </div>
  );
}
