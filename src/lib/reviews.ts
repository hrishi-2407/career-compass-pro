import { supabase } from "@/integrations/supabase/client";

export type Review = {
  id: string;
  name: string;
  photo_url: string | null;
  designation: string;
  location: string;
  linkedin: string | null;
  rating: number;
  review: string;
  created_at: string;
};

/** Ensure a stored LinkedIn value is a safe, absolute https URL. */
export function normalizeLinkedin(value: string | null): string | null {
  if (!value) return null;
  let v = value.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = `https://${v.replace(/^\/+/, "")}`;
  try {
    const u = new URL(v);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    u.protocol = "https:";
    return u.toString();
  } catch {
    return null;
  }
}

/** Extracts the storage object path from a stored review-photos URL. */
function storagePath(url: string): string | null {
  const m = url.match(/review-photos\/(.+)$/);
  return m ? m[1] : null;
}

/** Review photos live in a private bucket, so turn stored URLs into signed URLs. */
async function signPhotos(rows: Review[]): Promise<Review[]> {
  const paths = rows.map((r) => (r.photo_url ? storagePath(r.photo_url) : null));
  const unique = Array.from(new Set(paths.filter((p): p is string => !!p)));
  if (!unique.length) return rows;
  const { data } = await supabase.storage.from("review-photos").createSignedUrls(unique, 60 * 60);
  const map = new Map<string, string>();
  (data ?? []).forEach((d) => { if (d.path && d.signedUrl) map.set(d.path, d.signedUrl); });
  return rows.map((r, i) => {
    const p = paths[i];
    return p && map.has(p) ? { ...r, photo_url: map.get(p)! } : r;
  });
}

export async function fetchApprovedReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("public_reviews")
    .select("id,name,photo_url,designation,location,linkedin,rating,review,created_at")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) throw error;
  return signPhotos((data ?? []) as Review[]);
}

