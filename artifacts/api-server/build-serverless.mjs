/**
 * Serverless build for Vercel — bundles src/serverless.ts into ../../api/index.js
 * Pino worker files are copied alongside index.js.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { mkdir, copyFile, readdir, rename, rm } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const tmpDir = path.resolve(repoRoot, "api/.build");
const apiDir = path.resolve(repoRoot, "api");

await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir, { recursive: true });

await build({
  entryPoints: [path.resolve(__dirname, "src/serverless.ts")],
  platform: "node",
  bundle: true,
  format: "esm",
  outdir: tmpDir,
  logLevel: "info",
  external: [
    "*.node", "sharp", "better-sqlite3", "sqlite3", "canvas", "bcrypt",
    "argon2", "fsevents", "re2", "farmhash", "xxhash-addon", "bufferutil",
    "utf-8-validate", "ssh2", "cpu-features", "dtrace-provider", "isolated-vm",
    "lightningcss", "pg-native", "oracledb", "mongodb-client-encryption",
    "nodemailer", "handlebars", "knex", "typeorm", "protobufjs",
    "onnxruntime-node", "@tensorflow/*", "@prisma/client", "@mikro-orm/*",
    "@grpc/*", "@swc/*", "@aws-sdk/*", "@azure/*", "@opentelemetry/*",
    "@google-cloud/*", "@google/*", "googleapis", "firebase-admin",
    "@parcel/watcher", "@sentry/profiling-node", "aws-sdk", "classic-level",
    "dd-trace", "ffi-napi", "grpc", "hiredis", "kerberos", "leveldown",
    "miniflare", "mysql2", "newrelic", "odbc", "piscina", "realm", "ref-napi",
    "rocksdb", "sass-embedded", "sequelize", "serialport", "snappy",
    "tinypool", "usb", "workerd", "wrangler", "zeromq", "zeromq-prebuilt",
    "playwright", "puppeteer", "puppeteer-core", "electron",
  ],
  sourcemap: false,
  plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
  },
});

// Move all built files to api/  — rename serverless.js → index.js
const builtFiles = await readdir(tmpDir);
for (const file of builtFiles) {
  const src = path.join(tmpDir, file);
  const dest = path.join(apiDir, file === "serverless.js" ? "index.js" : file);
  await copyFile(src, dest);
}
await rm(tmpDir, { recursive: true, force: true });

console.log(`✓ Serverless bundle → ${apiDir}/index.js`);
