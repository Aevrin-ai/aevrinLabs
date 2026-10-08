import { describe, expect, it } from "vitest";

import { parseRange, withRanges } from "./range";

const SIZE = 1000;

describe("parseRange", () => {
  it("sends the whole file without a Range header", () => {
    expect(parseRange(null, SIZE)).toBeNull();
  });

  it("reads a closed range", () => {
    expect(parseRange("bytes=0-99", SIZE)).toEqual({ start: 0, end: 99 });
  });

  it("reads an open range to the end, the way players ask for the start", () => {
    expect(parseRange("bytes=500-", SIZE)).toEqual({ start: 500, end: 999 });
  });

  it("reads a suffix range: the last n bytes", () => {
    expect(parseRange("bytes=-100", SIZE)).toEqual({ start: 900, end: 999 });
  });

  it("caps a range that runs past the end", () => {
    expect(parseRange("bytes=900-5000", SIZE)).toEqual({ start: 900, end: 999 });
  });

  it("refuses a range that starts past the end", () => {
    expect(parseRange("bytes=1000-", SIZE)).toBe("unsatisfiable");
  });

  it("sends the whole file for headers it does not handle", () => {
    expect(parseRange("bytes=0-1,5-9", SIZE)).toBeNull();
    expect(parseRange("items=0-9", SIZE)).toBeNull();
    expect(parseRange("bytes=50-10", SIZE)).toBeNull();
  });
});

describe("withRanges", () => {
  const bytes = new Uint8Array(SIZE).map((_, i) => i % 256);
  const file = () => new Response(bytes, { headers: { "Content-Type": "video/mp4", "Cache-Control": "public, max-age=604800" } });
  const get = (range?: string, method = "GET") =>
    new Request("https://aevrinlabs.com/video/launch.mp4", { method, headers: range ? { Range: range } : {} });

  it("answers a range with 206 and just those bytes", async () => {
    const res = await withRanges(get("bytes=10-19"), file());
    expect(res.status).toBe(206);
    expect(res.headers.get("Content-Range")).toBe("bytes 10-19/1000");
    expect(res.headers.get("Content-Length")).toBe("10");
    expect([...new Uint8Array(await res.arrayBuffer())]).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });

  it("keeps the file's own headers", async () => {
    const res = await withRanges(get("bytes=0-0"), file());
    expect(res.headers.get("Content-Type")).toBe("video/mp4");
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=604800");
  });

  it("says ranges are welcome on a plain request", async () => {
    const res = await withRanges(get(), file());
    expect(res.status).toBe(200);
    expect(res.headers.get("Accept-Ranges")).toBe("bytes");
    expect((await res.arrayBuffer()).byteLength).toBe(SIZE);
  });

  it("answers a range past the end with 416", async () => {
    const res = await withRanges(get("bytes=5000-"), file());
    expect(res.status).toBe(416);
    expect(res.headers.get("Content-Range")).toBe("bytes */1000");
  });

  it("sends headers and no body for HEAD", async () => {
    const res = await withRanges(get("bytes=0-99", "HEAD"), file());
    expect(res.status).toBe(206);
    expect(res.headers.get("Content-Length")).toBe("100");
    expect(res.body).toBeNull();
  });

  it("passes a missing file through untouched", async () => {
    const res = await withRanges(get("bytes=0-9"), new Response("not found", { status: 404 }));
    expect(res.status).toBe(404);
  });
});
