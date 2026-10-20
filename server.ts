
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { ServerResponse } from "node:http";

const pagesDirectory = import.meta.dirname;

async function sendPage(
  res: ServerResponse,
  filename: string,
  statusCode = 200
): Promise<void> {
  const content = await readFile(
    resolve(pagesDirectory, filename),
    "utf8"
  );

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(content);
}

const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(
      req.url ?? "/",
      "http://localhost:8080"
    ).pathname;

    console.log("Requested URL:", pathname);

    if (pathname === "/about") {
      await sendPage(res, "about.html");
    } else if (pathname === "/contact-me") {
      await sendPage(res, "contact-me.html");
    } else if (pathname === "/") {
      await sendPage(res, "index.html");
    } else {
      await sendPage(res, "404.html", 404);
    }
  } catch (error) {
    console.error("Error serving page:", error);

    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
    }

    if (!res.writableEnded) {
      res.end("Internal Server Error");
    }
  }
});

server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
