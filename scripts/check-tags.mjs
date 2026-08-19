// Tag guard: fails the build if the analytics tags are missing from the output.
// This is our "drink our own champagne" safety net — a copy edit can never
// silently drop Google Tag Manager again.
import { readFileSync } from "node:fs";

const GTM_ID = "GTM-5VDF8HV7";
const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");

const gtmIdCount = (html.match(new RegExp(GTM_ID, "g")) || []).length;

const checks = [
	["GTM head loader (gtm.js)", html.includes("googletagmanager.com/gtm.js")],
	["GTM noscript fallback (ns.html)", html.includes("googletagmanager.com/ns.html")],
	[`GTM container id ${GTM_ID} present twice (loader + noscript)`, gtmIdCount >= 2],
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);

if (failed.length) {
	console.error("✖ Tag guard FAILED. Missing or broken:");
	for (const name of failed) console.error("   - " + name);
	console.error(`\nThe Google Tag Manager container (${GTM_ID}) must be in dist/index.html.`);
	process.exit(1);
}

console.log(`✓ Tag guard passed: GTM container ${GTM_ID} present (loader + noscript).`);
