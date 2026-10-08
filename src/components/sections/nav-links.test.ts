import { describe, expect, it } from "vitest";

import { CAPABILITIES } from "@/data/capabilities";
import { menus } from "./nav-links";

// The pages the router knows. Every link in the menus must land on one.
const ROUTES = ["/", "/product", "/about", "/contact"];

describe("the navigation menus", () => {
  const product = menus.find((m) => m.id === "product")!;

  it("has a Product menu and a Company menu", () => {
    expect(menus.map((m) => m.label)).toEqual(["Product", "Company"]);
  });

  it("keeps the Product menu wide and low: three columns of two", () => {
    expect(product.columns.map((c) => c.heading)).toEqual(["See", "Control", "Prove"]);
    for (const column of product.columns) expect(column.items).toHaveLength(2);
  });

  it("links every capability to its card on the product page", () => {
    const hrefs = product.columns.flatMap((c) => c.items.map((i) => i.href));
    expect(hrefs).toEqual(CAPABILITIES.map((c) => `/product#${c.id}`));
  });

  it("only links to pages that exist", () => {
    for (const menu of menus) {
      for (const item of menu.columns.flatMap((c) => c.items)) {
        expect(ROUTES, item.href).toContain(item.href.split("#")[0]);
      }
    }
  });

  it("gives every item an icon, a title and a one-line description", () => {
    for (const item of menus.flatMap((m) => m.columns.flatMap((c) => c.items))) {
      expect(typeof item.icon).toBe("function");
      expect(item.title).not.toBe("");
      expect(item.description).not.toBe("");
    }
  });
});
