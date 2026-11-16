import { forward } from "@ngrok/ngrok";

export async function createTunnel(port: number) {
  try {
    const listener = await forward({
      addr: `127.0.0.1:${port}`,
      authtoken_from_env: true,
    });

    console.log("Tunnel:", listener.url());

    return listener;
  } catch (error) {
    console.error("Ngrok error:", error);
    throw error;
  }
}
