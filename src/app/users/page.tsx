"use client";

import Image from "next/image";
import styles from "../page.module.css";
import NavBar from "@/components/NavBar";
import { useAccount } from "wagmi";
import { Box, List, ListItem, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const styling = {
  row: { display: "flex", flexDirection: "row" },
  column: { display: "flex", flexDirection: "column" },
};

export default function Home() {
  const { address } = useAccount();

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "address", headerName: "Address", width: 90, sortable: false },
    {
      field: "userType",
      headerName: "User type",
      width: 150,
    },
    {
      field: "matricNo",
      headerName: "Matric no",
      width: 150,
      sortable: false,
    },
    {
      field: "vp",
      headerName: "VP",
      type: "number",
      width: 110,
    },
    {
      field: "operations",
      type: "actions",
      headerName: "Operations",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      getActions: () => [
        <GridActionsCellItem
          icon={<EditIcon />}
          onClick={() => {}}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={() => {}}
          label="Delete"
        />,
      ],
      //   getActions:({id}) => { return ("")}
    },
  ];
  const rows = [
    {
      id: 1,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "S",
      matricNo: "A20EC4040",
      vp: 14,
    },
    {
      id: 2,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "CM",
      matricNo: "A20EC4041",
      vp: 31,
    },
    {
      id: 3,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "S",
      matricNo: "A20EC4042",
      vp: 31,
    },
    {
      id: 4,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "CM",
      matricNo: "A20EC4043",
      vp: 11,
    },
    {
      id: 5,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "S",
      matricNo: "A20EC4044",
      vp: 12,
    },
    {
      id: 6,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "CM",
      matricNo: "A20EC4045",
      vp: 150,
    },
    {
      id: 7,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "CM",
      matricNo: "A20EC4046",
      vp: 44,
    },
    {
      id: 8,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "S",
      matricNo: "A20EC4047",
      vp: 36,
    },
    {
      id: 9,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "S",
      matricNo: "A20EC4048",
      vp: 65,
    },
  ];
  return (
    <main className={styles.main}>
      <NavBar />
      <Box>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </main>
  );
}
