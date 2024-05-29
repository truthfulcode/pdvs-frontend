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
import { getSession, useSession } from "next-auth/react";
import { SIWESession } from "@web3modal/siwe";
import Link from "next/link";
import { ADDRESSES } from "@/utils/constants";
import { VotingToken } from "@/VotingToken";
import { Address } from "viem";

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
  //       const res = await fetch("/api/users/create", {
  //         method: "POST",
  //       });
  //       const json = await res.json();
  //       console.log("json res:", json);
  //       // setState((x) => ({ ...x, address: json.address }));
  //     } catch (_error) {}
  //   };
  //   // 1. page loads
  //   handler();

  //   // 2. window is focused (in case user logs out of another window)
  //   window.addEventListener("focus", handler);
  //   return () => window.removeEventListener("focus", handler);
  // }, []);

  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data, status } = useSession();
  const session = data as unknown as SIWESession;
  const [uType, setUType] = React.useState("");
  console.log("session", data, status);
  console.log("userType value", uType);
  React.useEffect(() => {
    //
    let value = "";
    if (status === "authenticated") {
      if (address === ADDRESSES.admin) {
        value = "Admin";
        setUType(value);
      } else {
        const fetch = async () => {
          let res;
          try {
            const vt = new VotingToken(undefined);
            const res = await vt.getUserType(address as Address);
            console.log("address n record", address, res);
            if (res) value = res === 1 ? "STUDENT" : res === 2 ? "CM" : "NONE";
            setUType(value);
            console.log("value", value)
          } catch (e) {
            console.log("failed", e);
          }
        };

        fetch();
      }
    } else {
      value = "";
    }
  }, [address, status]);
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/users">Users</Link>
            </li>
            <li>
              <Link href="/proposals">Proposals</Link>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">PDVS</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/users">Users</Link>
          </li>
          <li>
            <Link href="/proposals">Proposals</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <w3m-button />
        {/* <button onClick={() => open()}>CONNECT</button> */}
        <p className="rounded-full ml-4">{uType}</p>
      </div>
    </div>
  );
}
