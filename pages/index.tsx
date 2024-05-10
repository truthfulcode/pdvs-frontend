// "use client";
import styles from "../styles/page.module.css";
import NavBar from "@/components/NavBar";
import { SignMessage } from "@/components/SignMessage";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();
  return (
    <main>
      <NavBar />
      {/* <SignMessage /> */}
    </main>
  );
}
