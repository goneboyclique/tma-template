import { z } from "zod";
import { configDotenv } from "dotenv";

configDotenv();

const orvalConfigSchema = z.object({
  OPENAPI_INPUT_SRC: z.url(),
  PAYMENT_OPENAPI_INPUT_SRC: z.url(),
});

const env = orvalConfigSchema.parse(process.env);
const input = env.OPENAPI_INPUT_SRC;

const output = (target: string) => ({
  target,
  client: "vue-query" as const,
  mode: "single" as const,
  override: {
    mutator: {
      path: "./fetcher.ts",
      name: "customFetch",
    },
  },
});

export default {
  apiVue: {
    input,
    output: output("./clients/vue.ts"),
  },
  paymentVue: {
    input: env.PAYMENT_OPENAPI_INPUT_SRC,
    output: output("./clients/payment.ts"),
  },
};
