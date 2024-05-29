import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import Web3ModalProvider from "@/context";
import { WagmiProvider } from "wagmi";
import Loading from "@/components/Loading";

export default function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <Web3ModalProvider>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Loading>
          <Component {...pageProps} />
        </Loading>
      </SessionProvider>
    </Web3ModalProvider>
  );
}
