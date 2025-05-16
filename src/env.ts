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
      "8a5f46df4d50afec19f4d4d5d96d89c3",
    NEXT_PUBLIC_LENS_APP_ID:
      process.env.NEXT_PUBLIC_LENS_APP_ID ||
      "0x8A5Cc31180c37078e1EbA2A23c861Acf351a97cE",
  },

  emptyStringAsUndefined: true,
});
