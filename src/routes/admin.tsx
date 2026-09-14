import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Check, X, Trash2, LogOut, MessageSquare, ClipboardList, HelpCircle, Plus, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — AscendUS" }] }),
});

type Review = {
  id: string; name: string; email: string; photo_url: string | null;
  designation: string; location: string; linkedin: string | null;
  rating: number; review: string; status: "pending" | "approved" | "rejected";
  featured: boolean; created_at: string;
};
type Message = { id: string; name: string; email: string; phone: string | null; message: string; handled: boolean; created_at: string };
type Faq = { id: string; question: string; answer: string; sort_order: number };

function AdminPage() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { nav({ to: "/auth" }); return; }
      setUserEmail(data.user.email ?? null);
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      setReady(true);
    })();
  }, [nav]);

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/auth" });
  }

  if (!ready) return <div className="grid min-h-screen place-items-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-primary-foreground"><Sparkles className="h-4 w-4" /></span>
            AscendUS admin
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!isAdmin ? (
          <NoAccess />
        ) : (
          <Tabs defaultValue="reviews">
            <TabsList className="mb-6">
              <TabsTrigger value="reviews"><ClipboardList className="mr-2 h-4 w-4" /> Reviews</TabsTrigger>
              <TabsTrigger value="messages"><MessageSquare className="mr-2 h-4 w-4" /> Messages</TabsTrigger>
              <TabsTrigger value="faqs"><HelpCircle className="mr-2 h-4 w-4" /> FAQs</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews"><ReviewsPanel /></TabsContent>
            <TabsContent value="messages"><MessagesPanel /></TabsContent>
            <TabsContent value="faqs"><FaqsPanel /></TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

function NoAccess() {
  return (
    <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-elegant">
      <h2 className="text-xl font-bold">No admin access</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your account is signed in but doesn't have the admin role. Ask an existing admin to grant you access,
        or run this SQL from the Cloud dashboard using your user id:
      </p>
      <pre className="mt-4 overflow-auto rounded-lg bg-muted p-3 text-left text-xs">
        {`INSERT INTO public.user_roles (user_id, role)\nVALUES ('<your-user-id>', 'admin');`}
      </pre>
    </div>
  );
}

/* ---------------- Reviews ---------------- */
function ReviewsPanel() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reviews", tab],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").eq("status", tab).order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });
  const { data: stats } = useQuery({
    queryKey: ["admin", "review-stats"],
    queryFn: async () => {
      const [{ count: total }, { count: published }] = await Promise.all([
        supabase.from("reviews").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "approved"),
      ]);
      return { total: total ?? 0, published: published ?? 0 };
    },
  });

  async function setStatus(id: string, status: Review["status"]) {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    qc.invalidateQueries({ queryKey: ["admin", "review-stats"] });
    qc.invalidateQueries({ queryKey: ["reviews", "approved"] });
  }
  async function toggleFeatured(id: string, featured: boolean) {
    const { error } = await supabase.from("reviews").update({ featured: !featured }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    qc.invalidateQueries({ queryKey: ["admin", "review-stats"] });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total reviews" value={stats?.total ?? 0} />
        <StatCard label="Published reviews" value={stats?.published ?? 0} />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["pending", "approved", "rejected"] as const).map((s) => (
          <Button key={s} size="sm" variant={tab === s ? "default" : "outline"} onClick={() => setTab(s)} className="capitalize">
            {s}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {!isLoading && data?.length === 0 && <EmptyState label={`No ${tab} reviews`} />}
        {data?.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-elegant">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold">{r.name} <span className="text-xs font-normal text-muted-foreground">· {r.email}</span></div>
                <div className="text-sm text-muted-foreground">{r.designation} — {r.location}</div>
                <div className="mt-1 flex items-center gap-0.5 text-brand">{Array.from({length:r.rating}).map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-current"/>)}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {tab !== "approved" && <Button size="sm" onClick={() => setStatus(r.id, "approved")}><Check className="mr-1 h-3.5 w-3.5" /> Approve</Button>}
                {tab !== "rejected" && <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")}><X className="mr-1 h-3.5 w-3.5" /> Reject</Button>}
                {tab === "approved" && <Button size="sm" variant="outline" onClick={() => toggleFeatured(r.id, r.featured)}>{r.featured ? "Unfeature" : "Feature"}</Button>}
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground/90">"{r.review}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Messages ---------------- */
function MessagesPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Message[];
    },
  });
  async function toggleHandled(m: Message) {
    const { error } = await supabase.from("contact_messages").update({ handled: !m.handled }).eq("id", m.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "messages"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "messages"] });
  }
  return (
    <div className="space-y-3">
      {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
      {!isLoading && data?.length === 0 && <EmptyState label="No messages yet" />}
      {data?.map((m) => (
        <div key={m.id} className="rounded-xl border border-border bg-card p-5 shadow-elegant">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-semibold">{m.name} <span className="text-xs font-normal text-muted-foreground">· {m.email}{m.phone ? ` · ${m.phone}` : ""}</span></div>
              <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={m.handled ? "outline" : "default"} onClick={() => toggleHandled(m)}>{m.handled ? "Mark unhandled" : "Mark handled"}</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- FAQs ---------------- */
function FaqsPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return data as Faq[];
    },
  });
  const [form, setForm] = useState({ question: "", answer: "", sort_order: 0 });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    const { error } = await supabase.from("faqs").insert(form);
    if (error) return toast.error(error.message);
    setForm({ question: "", answer: "", sort_order: 0 });
    toast.success("FAQ added");
    qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
    qc.invalidateQueries({ queryKey: ["faqs"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
    qc.invalidateQueries({ queryKey: ["faqs"] });
  }
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={add} className="rounded-xl border border-border bg-card p-5 shadow-elegant lg:col-span-2">
        <div className="text-sm font-semibold">Add a FAQ</div>
        <div className="mt-4 space-y-3">
          <div><Label className="text-xs">Question</Label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required /></div>
          <div><Label className="text-xs">Answer</Label><Textarea rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required /></div>
          <div><Label className="text-xs">Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
        </div>
        <Button type="submit" className="mt-4 w-full gradient-brand text-primary-foreground"><Plus className="mr-1 h-4 w-4" /> Add FAQ</Button>
      </form>
      <div className="space-y-3 lg:col-span-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {!isLoading && data?.length === 0 && <EmptyState label="No FAQs yet" />}
        {data?.map((f) => (
          <div key={f.id} className="rounded-xl border border-border bg-card p-5 shadow-elegant">
            <div className="flex items-start justify-between gap-3">
              <div className="font-semibold">{f.question}</div>
              <Button size="sm" variant="ghost" onClick={() => remove(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
            <div className="mt-2 text-xs text-muted-foreground">Sort: {f.sort_order}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-elegant">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-bold text-gradient-brand">{value}</div>
    </div>
  );
}
function EmptyState({ label }: { label: string }) {
  return <div className="rounded-xl border border-dashed border-border bg-background/50 p-10 text-center text-sm text-muted-foreground">{label}</div>;
}
