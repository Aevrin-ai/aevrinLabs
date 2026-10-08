import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/*
  The writing rules, checked across every file a visitor can see: the source,
  the HTML shell and the text files in public/. A rule broken anywhere fails
  the build.
*/

const ROOT = join(import.meta.dirname, "..");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const FILES = [
  ...walk(join(ROOT, "src")).filter((f) => /\.(tsx?|css)$/.test(f) && !f.endsWith(".test.ts") && !f.endsWith(".test.tsx")),
  join(ROOT, "index.html"),
  ...walk(join(ROOT, "public")).filter((f) => /\.(txt|xml|webmanifest)$/.test(f)),
].map((path) => ({ path: relative(ROOT, path), text: readFileSync(path, "utf8") }));

function offenders(test: (line: string) => boolean) {
  return FILES.flatMap(({ path, text }) =>
    text.split("\n").flatMap((line, i) => (test(line) ? [`${path}:${i + 1}: ${line.trim().slice(0, 80)}`] : []))
  );
}

describe("copy rules", () => {
  it("found the files to check", () => {
    expect(FILES.length).toBeGreaterThan(30);
  });

  it("uses no em or en dashes", () => {
    expect(offenders((l) => /[—–]/.test(l))).toEqual([]);
  });

  it("uses no diagonal arrows", () => {
    expect(offenders((l) => /[↗↘↖↙]|ArrowUpRight/.test(l))).toEqual([]);
  });

  it("uses no emoji", () => {
    expect(offenders((l) => /\p{Extended_Pictographic}/u.test(l))).toEqual([]);
  });

  it("never says Coming Soon", () => {
    expect(offenders((l) => /coming soon/i.test(l))).toEqual([]);
  });

  it("makes no unbacked superlatives", () => {
    expect(offenders((l) => /\b(best|#1|number one|world-class|industry-leading)\b/i.test(l))).toEqual([]);
  });

  it("does not reuse the source script's phrases", () => {
    const phrases = /control plane for the agentic enterprise|never got the handbook|the future of enterprise work arrived early/i;
    expect(offenders((l) => phrases.test(l))).toEqual([]);
  });

  it("writes the name one way in copy", () => {
    // The logo artwork says "aevrin labs"; the words on the page say Aevrinlabs.
    expect(offenders((l) => /Aevrin Labs|AevrinLabs|Aevrin\.ai/.test(l))).toEqual([]);
  });
});

describe("the HTML shell", () => {
  const html = readFileSync(join(ROOT, "index.html"), "utf8");

  it("has a title, a description and a canonical link", () => {
    expect(html).toMatch(/<title>Aevrinlabs: [^<]+<\/title>/);
    expect(html).toMatch(/<meta\s+name="description"/);
    expect(html).toContain('<link rel="canonical" href="https://aevrinlabs.com/"');
  });

  it("has Open Graph and Twitter cards pointing at the share image", () => {
    for (const tag of ["og:title", "og:description", "og:image", "og:url"]) expect(html).toContain(`property="${tag}"`);
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain("https://aevrinlabs.com/og.png");
  });

  it("lists every page in the sitemap", () => {
    const sitemap = readFileSync(join(ROOT, "public", "sitemap.xml"), "utf8");
    for (const path of ["/", "/product", "/about", "/contact"]) {
      expect(sitemap).toContain(`<loc>https://aevrinlabs.com${path}</loc>`);
    }
  });
});
