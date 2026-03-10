import * as esbuild from "esbuild";

const ARGS = process.argv.slice(2);
const IS_WATCH = ARGS.includes("--watch");
const IS_CLIENT = ARGS.includes("--client");
const IS_SERVER = ARGS.includes("--server");

// If neither is provided, build both
const BUILD_CLIENT = IS_CLIENT || (!IS_CLIENT && !IS_SERVER);
const BUILD_SERVER = IS_SERVER || (!IS_CLIENT && !IS_SERVER);

const CLIENT_CONFIG = {
	entryPoints: ["src/client/index.ts"],
	outfile: "dist/client-bundle.cjs",
	bundle: true,
	platform: "browser",
	format: "iife",
	logLevel: "info",
	minify: true,
};

const SERVER_CONFIG = {
	entryPoints: ["src/server/index.ts"],
	outfile: "dist/server-bundle.cjs",
	bundle: true,
	platform: "node",
	format: "cjs",
	packages: "external",
	logLevel: "info",
};

try {
	if (IS_WATCH) {
		if (BUILD_CLIENT) {
			const clientCtx = await esbuild.context(CLIENT_CONFIG);
			await clientCtx.watch();
		}
		if (BUILD_SERVER) {
			const serverCtx = await esbuild.context(SERVER_CONFIG);
			await serverCtx.watch();
		}
		console.log("Watching for changes...");
	} else {
		const promises = [];
		if (BUILD_CLIENT) {
			promises.push(esbuild.build(CLIENT_CONFIG));
		}
		if (BUILD_SERVER) {
			promises.push(esbuild.build(SERVER_CONFIG));
		}
		await Promise.all(promises);
		console.log("Build complete.");
	}
} catch (err) {
	console.error("Build failed:", err);
	process.exit(1);
}
