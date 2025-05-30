import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_LENS_APP_ID: z.string().min(1),
  },

  runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
      "9789d226714874a576608f98cdf36855",
    NEXT_PUBLIC_LENS_APP_ID:
      process.env.NEXT_PUBLIC_LENS_APP_ID ||
      "0x8A5Cc31180c37078e1EbA2A23c861Acf351a97cE",
  },

  emptyStringAsUndefined: true,
});
