import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
  },

  runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "MY_KEY",
  },

  emptyStringAsUndefined: true,
});
