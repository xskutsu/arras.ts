import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const PORT = process.env.PORT ?? "3001";
const PUBLIC_PATH = path.resolve(process.cwd(), "public");
const DIST_PATH = path.resolve(process.cwd(), "dist");

const MIME_TYPES = new Map([
	[".html", "text/html"],
	[".css", "text/css"],
	[".js", "application/javascript"],
	[".cjs", "application/javascript"],
	[".mjs", "application/javascript"],
	[".json", "application/json"],
	[".png", "image/png"],
	[".jpg", "image/jpeg"],
	[".jpeg", "image/jpeg"],
	[".gif", "image/gif"],
	[".svg", "image/svg+xml"],
	[".ico", "image/x-icon"],
	[".xml", "application/xml"],
	[".txt", "text/plain"],
	[".webmanifest", "application/manifest+json"],
]);

const server = http.createServer((request, response) => {
	console.log(`[HTTP] ${request.method} ${request.url}`);

	let urlPath = request.url ?? "";
	if (urlPath === undefined) {
		urlPath = "";
	} else {
		urlPath = urlPath.split("?")[0];
		if (urlPath === "/") {
			urlPath = "/index.html";
		}
	}

	let filePath;
	if (urlPath === "/js/bundle.js") {
		filePath = path.join(DIST_PATH, "client-bundle.cjs");
	} else {
		try {
			urlPath = decodeURIComponent(urlPath);
		} catch {
			response.writeHead(400, { "Content-Type": "text/plain" });
			response.end("400 Bad Request");
			return;
		}
		if (urlPath.startsWith("/")) {
			urlPath = urlPath.slice(1);
		}
		filePath = path.resolve(PUBLIC_PATH, urlPath);
	}

	if (!filePath.startsWith(PUBLIC_PATH) && !filePath.startsWith(DIST_PATH)) {
		response.writeHead(403, { "Content-Type": "text/plain" });
		response.end("403 Forbidden");
		return;
	}

	fs.stat(filePath, (err, stats) => {
		if (err || !stats.isFile()) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end("404 Not Found");
			return;
		}

		const ext = path.extname(filePath).toLowerCase();
		const contentType = MIME_TYPES.get(ext) ?? "application/octet-stream";
		response.writeHead(200, { "Content-Type": contentType });
		fs.createReadStream(filePath).pipe(response);
	});
});

server.listen(PORT, () => {
	console.log(`[HTTP] DEV Server listening on http://localhost:${PORT}`);
});
