import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Success Stories", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-primary-foreground shadow-elegant">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg">AscendUS</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/submit-review"><Button variant="ghost" size="sm">Share your story</Button></Link>
          <a href="/#contact"><Button size="sm" className="gradient-brand text-primary-foreground shadow-elegant hover:opacity-95">Book free consult</Button></a>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                {n.label}
              </a>
            ))}
            <Link to="/submit-review" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Share your story</Link>
            <a href="/#contact" onClick={() => setOpen(false)} className="mt-2 rounded-md gradient-brand px-3 py-2 text-center text-sm font-semibold text-primary-foreground">Book free consult</a>
          </div>
        </div>
      )}
    </header>
  );
}
