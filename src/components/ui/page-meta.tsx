import { useEffect } from "react";

import { BRAND, SITE_URL } from "@/lib/site";

/*
  A page's title and description. index.html carries the home page's tags for
  anything that reads the page without running it; each page updates those
  same tags in place, so the head never holds two of anything.
*/
function set(selector: string, value: string, attr = "content") {
  document.head.querySelector(selector)?.setAttribute(attr, value);
}

export function PageMeta({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    const full = path === "/" ? title : `${title} | ${BRAND}`;
    const url = `${SITE_URL}${path}`;
    document.title = full;
    set('meta[name="description"]', description);
    set('link[rel="canonical"]', url, "href");
    set('meta[property="og:title"]', full);
    set('meta[property="og:description"]', description);
    set('meta[property="og:url"]', url);
    set('meta[name="twitter:title"]', full);
    set('meta[name="twitter:description"]', description);
  }, [title, description, path]);
  return null;
}
