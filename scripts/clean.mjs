import fs from "node:fs/promises";
import path from "node:path";

const DIST_PATH = path.resolve(process.cwd(), "dist");

try {
	await fs.rm(DIST_PATH, {
		recursive: true,
		force: true,
	});
	console.log("Cleaned dist directory successfully.");
} catch (err) {
	console.error("Failed to clean dist directory:", err);
	process.exit(1);
}
