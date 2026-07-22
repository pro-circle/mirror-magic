// Prerenders route(s) into dist/client/*.html so Firebase Hosting (static) can serve them.
// Runs after `bun run build`. Uses the Nitro SSR bundle directly.
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const ROUTES = ["/"];
const CLIENT_DIR = new URL("../dist/client/", import.meta.url);
const SSR_ENTRY = new URL("../dist/server/_ssr/ssr.mjs", import.meta.url);

const mod = await import(pathToFileURL(SSR_ENTRY.pathname).href);
const handler = mod.default;
if (!handler?.fetch) {
  throw new Error("SSR handler missing .fetch — did the build run?");
}

for (const route of ROUTES) {
  const req = new Request(`http://localhost${route}`, { method: "GET" });
  const res = await handler.fetch(req);
  if (!res.ok) {
    console.error(`Prerender ${route} failed: ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();
  const outPath =
    route === "/"
      ? new URL("index.html", CLIENT_DIR)
      : new URL(`.${route}/index.html`, CLIENT_DIR);
  await mkdir(dirname(outPath.pathname), { recursive: true });
  await writeFile(outPath, html, "utf8");
  console.log(`✓ prerendered ${route} → ${outPath.pathname}`);
}
