import { Link } from "@tanstack/react-router";
import { Sparkles, Linkedin, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-primary-foreground shadow-elegant">
              <Sparkles className="h-4 w-4" />
            </span>
            AscendUS
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A technical, transparent job-search partner for tech professionals landing high-paying roles in the U.S.
          </p>
        </div>
        <FooterCol
          title="Company"
          links={[
            { label: "About", href: "/#about" },
            { label: "Services", href: "/#services" },
            { label: "Success Stories", href: "/#testimonials" },
            { label: "FAQ", href: "/#faq" },
          ]}
        />
        <FooterCol
          title="Resources"
          links={[
            { label: "Share your story", href: "/submit-review" },
            { label: "Book consultation", href: "/#contact" },
            // { label: "Admin", href: "/admin" },
          ]}
        />
        <div>
          <div className="text-sm font-semibold">Contact</div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {/* <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> suhas112001@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> hrishibari24@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +91 9146624409
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +91 7083390189
            </li> */}
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:suhas112001@gmail.com" className="transition-colors hover:text-brand">
                suhas112001@gmail.com
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:hrishibari24@gmail.com" className="transition-colors hover:text-brand">
                hrishibari24@gmail.com
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href="tel:+919146624409" className="transition-colors hover:text-brand">
                +91 91466 24409
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href="tel:+917083390189" className="transition-colors hover:text-brand">
                +91 70833 90189
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <div>© {new Date().getFullYear()} AscendUS. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="/#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="/#" className="hover:text-foreground">
              Terms
            </a>
            <a href="/#contact" className="hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("/#") || l.href.startsWith("#") ? (
              <a href={l.href} className="hover:text-foreground">
                {l.label}
              </a>
            ) : (
              <Link to={l.href} className="hover:text-foreground">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
