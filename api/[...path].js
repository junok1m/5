export default async function handler(req, res) {
  try {
    const incoming = new URL(req.url, "https://n5m.au");
    const target = `https://n5m.au${incoming.pathname}${incoming.search}`;

    const upstream = await fetch(target, {
      method: req.method,
      headers: {
        accept: req.headers.accept || "application/json",
      },
    });

    const body = await upstream.text();
    const contentType =
      upstream.headers.get("content-type") || "application/json; charset=utf-8";

    res.status(upstream.status);
    res.setHeader("content-type", contentType);
    res.send(body);
  } catch (error) {
    res.status(502);
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.send(
      JSON.stringify({
        error: "API proxy failed",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}
