import { createServer } from "http";
import express from "express";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT) || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.disable("x-powered-by");

  // Next.js owns all routing: App Router pages, Route Handlers (/api/*), Server Actions,
  // and middleware.ts all run exactly as they would under `next start`. Express exists here
  // as the process entry point so this fits a standard Node.js host / $5 VPS / PM2 setup.
  server.all("*", (req, res) => handle(req, res));

  createServer(server).listen(port, () => {
    console.log(`> 4F Store ready on http://localhost:${port} (${dev ? "development" : "production"})`);
  });
});
