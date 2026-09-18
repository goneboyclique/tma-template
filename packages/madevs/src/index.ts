import { spawn } from "node:child_process";
import { createTunnel } from "./tunnel.js";

const tunnel = await createTunnel(4000);
if (!tunnel) throw new Error("Untun tunnel is undefined");

const apiUrl = await tunnel.getURL();

console.log(`API tunnel: ${apiUrl}`);

const turbo = spawn("pnpm", ["-w", "exec", "turbo", "dev"], {
  stdio: "inherit",
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
