import { z } from "zod";
import { loadEnv, searchForWorkspaceRoot } from "vite";

let env: z.infer<typeof schema>;
const root = searchForWorkspaceRoot(process.cwd());

const schema = z.object({
  VITE_API_URL: z.url(),
  VITE_HTTPS: z.coerce.boolean().default(false),
});

// for vite you should init env using this method
export const initEnv = (mode: string) => {
  env = schema.parse(loadEnv(mode, root, "VITE_"));
};

export { env };
