import { forward } from "@ngrok/ngrok";

export async function createTunnel(port: number) {
  return await forward({ addr: `localhost:${port}`, authtoken_from_env: true })
}
