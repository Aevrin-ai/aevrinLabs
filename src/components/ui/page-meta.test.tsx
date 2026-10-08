import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { PageMeta } from "./page-meta";

// The tags index.html ships with, which each page updates in place.
const HEAD = `
  <title>Start</title>
  <meta name="description" content="start" />
  <link rel="canonical" href="https://aevrinlabs.com/" />
  <meta property="og:title" content="start" />
  <meta property="og:description" content="start" />
  <meta property="og:url" content="https://aevrinlabs.com/" />
  <meta name="twitter:title" content="start" />
  <meta name="twitter:description" content="start" />
`;

const attr = (selector: string, name = "content") => document.head.querySelector(selector)?.getAttribute(name);

describe("PageMeta", () => {
  beforeEach(() => {
    document.head.innerHTML = HEAD;
  });

  it("titles inner pages with the page name and the brand", () => {
    render(<PageMeta path="/about" title="About us" description="Why we build it." />);
    expect(document.title).toBe("About us | Aevrinlabs");
    expect(attr('meta[property="og:title"]')).toBe("About us | Aevrinlabs");
    expect(attr('meta[name="twitter:title"]')).toBe("About us | Aevrinlabs");
  });

  it("uses the home page title as it is", () => {
    render(<PageMeta path="/" title="Aevrinlabs: home" description="Home." />);
    expect(document.title).toBe("Aevrinlabs: home");
  });

  it("updates the description and the canonical address", () => {
    render(<PageMeta path="/contact" title="Contact us" description="Send us a note." />);
    expect(attr('meta[name="description"]')).toBe("Send us a note.");
    expect(attr('meta[property="og:description"]')).toBe("Send us a note.");
    expect(attr('link[rel="canonical"]', "href")).toBe("https://aevrinlabs.com/contact");
    expect(attr('meta[property="og:url"]')).toBe("https://aevrinlabs.com/contact");
  });

  it("never adds a second copy of a tag", () => {
    render(<PageMeta path="/product" title="Product" description="Six things." />);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.head.querySelectorAll("title")).toHaveLength(1);
  });
});
