"use client";

import Image from "next/image";
import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import { useAccount } from "wagmi";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { performPOST } from "@/utils/httpRequest";
import { getListings } from "../../prisma/operations/users/read";
import { useState } from "react";

const styling = {
  row: { display: "flex", flexDirection: "row" },
  column: { display: "flex", flexDirection: "column" },
};

export const getServerSideProps = async () => {
  // Fetch data from external API
  const listings = await getListings(1);
  const session = await getSession();
  // Pass data to the page via props
  return { props: { listings, session } };
};

export default function Home({ listings, session }) {
  const { address } = useAccount();
  // const { data: session, status } = useSession();
  console.log("session", session)
  const [deleteId, setDeleteId] = useState(0);

  const Modal = () => {
    return (
      <>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete User</h3>
            <p className="py-4">Are you sure you want to delete the user?</p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  className="btn mr-4"
                  onClick={async () => {
                    await submit(deleteId);
                  }}
                >
                  Confirm
                </button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </>
    );
  };

  console.log("listings", listings);
  async function submit(userId: number) {
    await performPOST(
      "/api/users/delete",
      JSON.stringify({ userId }),
      (res) => {
        console.log("remove user res:", res);
      },
      (err) => {
        console.log("remove user err:", err);
      }
    );
  }

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "userAddress", headerName: "Address", width: 90, sortable: false },
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
      field: "fullName",
      headerName: "Full name",
      width: 150,
      sortable: false,
    },
    {
      field: "cgpa",
      headerName: "CGPA",
      type: "number",
      width: 110,
    },
    {
      field: "delete",
      type: "actions",
      headerName: "Delete",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 110,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={async () => {
            // removes user
            // TODO add userId
            setDeleteId(Number(id));
            document.getElementById("my_modal_1")!.showModal();
            // await submit("1");
          }}
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
      cgpa: 3.5,
    },
    {
      id: 2,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "CM",
      matricNo: "A20EC4041",
      cgpa: 3.89,
    },
    {
      id: 3,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "S",
      matricNo: "A20EC4042",
      cgpa: 3.46,
    },
    {
      id: 4,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "CM",
      matricNo: "A20EC4043",
      cgpa: 2.37,
    },
    {
      id: 5,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "S",
      matricNo: "A20EC4044",
      cgpa: 2.98,
    },
    {
      id: 6,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "CM",
      matricNo: "A20EC4045",
      cgpa: 2.57,
    },
    {
      id: 7,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "CM",
      matricNo: "A20EC4046",
      cgpa: 3.98,
    },
    {
      id: 8,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "S",
      matricNo: "A20EC4047",
      cgpa: 3.87,
    },
    {
      id: 9,
      address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      userType: "S",
      matricNo: "A20EC4048",
      cgpa: 3.77,
    },
  ];

  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        {session ? (
          <>
            <Button href="/users/add">New User</Button>
            <Modal />
            <DataGrid rows={listings} columns={columns} />
          </>
        ) : (
          <>Admin restricted page</>
        )}
      </Box>
    </main>
  );
}
