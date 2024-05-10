// "use client";

import Image from "next/image";
import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import { useAccount } from "wagmi";
import { Box, List, ListItem, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect } from "react";
import { SnapshotGraphQL } from "@/graphql/SnapshotGraphQL";

export default function Proposals() {
  useEffect(() => {
    const snap = new SnapshotGraphQL();
    const getProposals = async () => {
      console.log(await snap.getProposals());
    };

    getProposals().catch((err) => {
      console.log("err proposals", err);
    });
  }, []);
  return (
    <main>
      <NavBar />
      <Box>{/* // */}</Box>
    </main>
  );
}