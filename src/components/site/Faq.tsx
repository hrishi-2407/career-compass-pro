import { useQuery } from "@tanstack/react-query";
import { fetchFaqs } from "@/lib/faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Faq() {
  const { data } = useQuery({ queryKey: ["faqs"], queryFn: fetchFaqs });
  const faqs = data ?? [];
  return (
    <section id="faq" className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-brand">FAQ</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Answers to common questions</h2>
        </div>
        <div className="mt-10 rounded-2xl border border-border bg-card p-2 shadow-elegant">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="border-b last:border-b-0">
                <AccordionTrigger className="px-4 text-left text-base font-semibold hover:no-underline">{f.question}</AccordionTrigger>
                <AccordionContent className="px-4 text-sm text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
            {faqs.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No FAQs yet.</div>
            )}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
