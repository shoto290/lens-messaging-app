"use client";

import { useAccount } from "@/hooks/use-account";
import { LoadingPage } from "@/components/pages/loading-page";

export default function RootLayout({
  login,
  app,
}: Readonly<{
  login: React.ReactNode;
  app: React.ReactNode;
}>) {
  const { initialized, hasAccount } = useAccount();

  if (!initialized) {
    return <LoadingPage />;
  }

  return hasAccount ? app : login;
}
