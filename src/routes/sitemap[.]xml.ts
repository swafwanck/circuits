import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { API_BASE_URL } from "./../lib/api";

async function slugs(path: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const data = await res.json();
    const rows: Array<{ slug?: string }> = Array.isArray(data) ? data : (data?.results ?? []);
    return rows.map((r) => String(r.slug ?? "")).filter(Boolean);
  } catch {
    return [];
  }
}

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [packages, deals, hotels, uaeActivities, visas] = await Promise.all([
          slugs("/api/packages/"),
          slugs("/api/deals/"),
          slugs("/api/hotels/"),
          slugs("/api/activities/"),
          slugs("/api/visas/"),
        ]);

        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/packages", priority: "0.9", changefreq: "daily" },
          { path: "/deals", priority: "0.9", changefreq: "daily" },
          { path: "/visa", priority: "0.9", changefreq: "weekly" },
          { path: "/hotels", priority: "0.8", changefreq: "weekly" },
          { path: "/activities-uae", priority: "0.8", changefreq: "weekly" },
          { path: "/about", priority: "0.5" },
          { path: "/contact", priority: "0.5" },
          ...packages.map((slug) => ({ path: `/packages/${slug}`, priority: "0.8" })),
          ...deals.map((slug) => ({ path: `/deals/${slug}`, priority: "0.8" })),
          ...hotels.map((slug) => ({ path: `/hotels/${slug}`, priority: "0.7" })),
          ...uaeActivities.map((slug) => ({ path: `/activities-uae/${slug}`, priority: "0.7" })),
          ...visas.map((slug) => ({ path: `/visa#${slug}`, priority: "0.6" })),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
          .map((e: { path: string; priority: string; changefreq?: string }) => `  <url><loc>${BASE_URL}${e.path}</loc>${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""}<priority>${e.priority}</priority></url>`)
          .join("\n")}\n</urlset>`;

        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
