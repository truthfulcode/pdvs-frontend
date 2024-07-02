"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import * as React from "react";
import { useAccount, useConnect } from "wagmi";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { isBrowser } from "react-device-detect";

export default function NavBar() {
  const { isConnected } = useAccount();
  const { error } = useConnect()
  const { userType, fullName } = useUser();

  React.useEffect(() => { console.log("error", error) }, [error])
  return (
    <div className="navbar bg-black">
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
          {isConnected && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {userType === "ADMIN" && (
                <li className="text-white">
                  <Link href="/users">
                    Users
                  </Link>
                </li>
              )}
              <li className="text-white">
                <Link href="/proposals">
                  Proposals
                </Link>
              </li>
              <li className="text-white">
                <Link href="/glossary">
                  Glossary
                </Link>
              </li>
            </ul>
          )}
        </div>
        <a className="btn btn-ghost text-xl text-white">PDVS</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {userType === "ADMIN" && (
            <li className="text-white">
              <Link href="/users">Users</Link>
            </li>
          )}
          <li className="text-white">
            <Link href="/proposals">Proposals</Link>
          </li>
          <li className="text-white">
            <Link href="/glossary">Glossary</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {fullName !== "Admin" && isBrowser && (
          <p className="rounded-full bg-gray text-white text-xs">
            {fullName.toLocaleUpperCase()}
          </p>
        )}
        <p className="rounded-full text-white ml-4 text-xs">
          {userType.toLocaleUpperCase()}
        </p>
        <w3m-button balance="hide" />
      </div>
    </div>
  );
}
