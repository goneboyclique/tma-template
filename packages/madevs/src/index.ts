import { spawn } from "node:child_process";
import { loadEnvFile } from "node:process";

import { createTunnel } from "./tunnel.js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../../..', '.env');

loadEnvFile(envPath);

const tunnel = await createTunnel(4000);
if (!tunnel) throw new Error("Tunnel is undefined");

const apiUrl = tunnel.url();

const isWindows = process.platform === "win32";

const turbo = spawn(isWindows ? "pnpm.cmd" : "pnpm", ["-w", "exec", "turbo", "dev"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    VITE_API_URL: apiUrl,
  },
});

const shutdown = async () => {
  await tunnel?.close();
  turbo?.kill();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

turbo.on("exit", async (code) => {
  await tunnel.close();
  process.exit(code ?? 0);
});
