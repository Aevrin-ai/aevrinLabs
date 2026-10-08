/*
  Byte ranges for the files the Worker serves. Browsers ask for a video in
  pieces (Safari will not play one at all without it), and seeking jumps
  straight to the piece it needs.
*/

export type ByteRange = { start: number; end: number };

/*
  Reads a Range header against a file of `size` bytes. Returns the range to
  send, null to send the whole file (no header, or one this does not handle,
  such as several ranges at once), or "unsatisfiable" when it starts past the
  end of the file.
*/
export function parseRange(header: string | null, size: number): ByteRange | null | "unsatisfiable" {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;
  const [, from, to] = match;
  if (from === "" && to === "") return null;

  // "bytes=-500": the last 500 bytes.
  if (from === "") {
    const length = Number(to);
    if (length === 0) return "unsatisfiable";
    return { start: Math.max(0, size - length), end: size - 1 };
  }

  const start = Number(from);
  if (start >= size) return "unsatisfiable";
  const end = to === "" ? size - 1 : Math.min(Number(to), size - 1);
  if (end < start) return null;
  return { start, end };
}

// The response for a request, given the whole file as served by the assets.
export async function withRanges(request: Request, file: Response): Promise<Response> {
  const headers = new Headers(file.headers);
  headers.set("Accept-Ranges", "bytes");

  const header = request.headers.get("Range");
  if (!file.ok || !header || (request.method !== "GET" && request.method !== "HEAD")) {
    return new Response(file.body, { status: file.status, statusText: file.statusText, headers });
  }

  const body = await file.arrayBuffer();
  const size = body.byteLength;
  const range = parseRange(header, size);

  if (range === "unsatisfiable") {
    headers.set("Content-Range", `bytes */${size}`);
    headers.delete("Content-Length");
    return new Response(null, { status: 416, headers });
  }
  if (range === null) {
    return new Response(request.method === "HEAD" ? null : body, { status: 200, headers });
  }

  const { start, end } = range;
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(request.method === "HEAD" ? null : body.slice(start, end + 1), { status: 206, headers });
}
