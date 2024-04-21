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
