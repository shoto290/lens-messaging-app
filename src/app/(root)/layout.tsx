"use client";

import { useAccount } from "@/hooks/use-account";
import { LoadingPage } from "@/pages/loading-page";

export default function RootLayout({
  login,
  app,
}: Readonly<{
  login: React.ReactNode;
  app: React.ReactNode;
}>) {
  const { isLoggedIn, initialized } = useAccount();

  if (!initialized) {
    return <LoadingPage />;
  }

  return isLoggedIn ? app : login;
}
