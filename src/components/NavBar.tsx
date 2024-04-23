"use client";
import {
  Box,
  makeStyles,
  AppBar,
  Toolbar,
  Paper,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import * as React from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { SignInButton } from "./SignInButton";
import { useSession } from "next-auth/react";
import { SIWESession } from "@web3modal/siwe";

export default function NavBar() {
  // const [state, setState] = React.useState<{
  //   address?: string;
  //   error?: Error;
  //   loading?: boolean;
  // }>({});

  // Fetch user when:
  // React.useEffect(() => {
  //   const handler = async () => {
  //     try {
  //       const res = await fetch("/api/me");
  //       const json = await res.json();
  //       setState((x) => ({ ...x, address: json.address }));
  //     } catch (_error) {}
  //   };
  //   // 1. page loads
  //   handler();

  //   // 2. window is focused (in case user logs out of another window)
  //   window.addEventListener("focus", handler);
  //   return () => window.removeEventListener("focus", handler);
  // }, []);

  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data, status } = useSession();
  const session = data as unknown as SIWESession;

  // if (isConnected) {
  //   return (
  //     <div>
  //       {/* Account content goes here */}
  //       <Session />
  //       {state.address ? (
  //         <div>
  //           <div>Signed in as {state.address}</div>
  //           <button
  //             onClick={async () => {
  //               await fetch("/api/logout");
  //               setState({});
  //             }}
  //           >
  //             Sign Out
  //           </button>
  //         </div>
  //       ) : (
  //         <SignInButton
  //           onSuccess={({ address }) => setState((x) => ({ ...x, address }))}
  //           onError={({ error }) => setState((x) => ({ ...x, error }))}
  //         />
  //       )}
  //     </div>
  //   );
  // }

  return (
    <header>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py:12 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Welcome Back, Barry!
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              Let's write a new blog post! 🎉
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            <button
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-5 py-3 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring"
              type="button"
            >
              <span className="text-sm font-medium"> View Website </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </button>

            <button
              className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
              type="button"
            >
              Create Post
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // return <div>{/* Connect wallet content goes here */}</div>
  return (
    <AppBar position="fixed">
      <Toolbar
        disableGutters
        sx={{ padding: "0px 16px", backgroundColor: "white" }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <Image alt="logo" src="/vercel.svg" height="75" width="75" />
        </IconButton>
        {/* TODO: add list of links */}
        <Typography
          color="black"
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {status}
        </Typography>
        {/* <Web3Modal /> */}
        {/* <Button
          onClick={() => {
            isConnected ? disconnect() : open();
          }}
          color="inherit"
          sx={{ color: "black", border: "1.5px solid black" }}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button> */}
        <w3m-button />
      </Toolbar>
    </AppBar>
  );
}
