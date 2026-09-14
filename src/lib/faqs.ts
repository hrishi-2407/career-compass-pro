import { supabase } from "@/integrations/supabase/client";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export async function fetchFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase
    .from("faqs")
    .select("id,question,answer,sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
