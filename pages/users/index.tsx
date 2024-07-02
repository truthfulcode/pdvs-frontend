"use client";

import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";
import { performBriefPOST, performPOST } from "@/utils/httpRequest";
import { useContext, useState } from "react";
import RestrictedPage from "@/components/RestrictedPage";
import { getUsers } from "../../prisma/operations/users/read";
import { GlobalContext } from "../_app";
import { PrimaryButton } from "@/components/styledElements";
import { MobileView, isBrowser, isMobile } from 'react-device-detect';
import Head from "next/head";

export const getServerSideProps = async () => {
  // Fetch data from external API
  let listings = await getUsers();

  if (listings) {
    listings = listings.map((l) => {
      return { ...l, cgpa: l.cgpa / 100 };
    });
  }

  // Pass data to the page via props
  return { props: { listings } };
};

export default function Home({ listings }: { listings: any }) {
  const { data: session, status } = useSession();
  const [deleteId, setDeleteId] = useState("");
  const openSnackBar = useContext(GlobalContext)

  // TODO revoke authentication access upon user removal
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

  async function submit(userId: string) {
    await performPOST(
      "/api/users/delete",
      JSON.stringify({ userId }),
      (res: any) => {
        openSnackBar("User deleted!", "success");
        location.reload();
      },
      (err: any) => {
        const { message } = err;
        openSnackBar(message, "error");
      }
    );
  }

  const columns: GridColDef<(typeof listings)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "userAddress", headerName: "Address", width: 90, sortable: false },
    {
      field: "userType",
      headerName: "User type",
      width: 150,
    },
    {
      field: "matricNumber",
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
          key={id}
          icon={<DeleteIcon />}
          onClick={async () => {
            setDeleteId(id as string);
            (
              document.getElementById("my_modal_1") as HTMLDialogElement
            ).showModal();
          }}
          label="Delete"
        />,
      ],
    },
  ];

  return (
    <main>
      <Head>
        <title>List of Users</title>
        <meta name="description" content="View a list of registered users actively participating in discussions and proposals." />
      </Head>

      <NavBar />
      <Box
        className={isMobile ? "" : styles.main}
      >
        <RestrictedPage validAccess={!!session}>
          <Box
            sx={{
              mt: isMobile ? 2 : undefined,
              width: isMobile ? undefined : "860px",
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-end",
            }}
          >
            <PrimaryButton sx={{ mb: 1 }} href="/users/create">
              Create User
            </PrimaryButton>
          </Box>
          <Modal />
          {listings.length === 0 ? (
            <h1 className="mb-16 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
              No Users Found{" "}
            </h1>
          ) : (
            <DataGrid rows={listings} columns={columns} />
          )}
          <MobileView>
            <Typography mt={1}>
              **Swipe sideways to view more details**
            </Typography>
          </MobileView>
        </RestrictedPage>
      </Box>
    </main>
  );
}
