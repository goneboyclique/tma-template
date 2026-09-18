import { startTunnel } from "untun";

export async function createTunnel(port: number) {
  return startTunnel({ url: `http://localhost:${port}` as const });
}
