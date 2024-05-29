// "use client";

import styles from "../../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { SnapshotGraphQL } from "@/snapshot/graphql/SnapshotGraphQL";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useRouter } from "next/router";
import { Proposal } from "@prisma/client";
import { performBriefPOST, performPOST } from "@/utils/httpRequest";
import { getProposalLiked } from "../../../prisma/operations/proposals/put";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getUserByAddress } from "../../../prisma/operations/users/read";
import { getProposalById } from "../../../prisma/operations/proposals/read";
import RestrictedPage from "@/components/RestrictedPage";
import { useSession } from "next-auth/react";

export const getServerSideProps = async ({ params, req, res }) => {
  const { id } = params;

  // Fetch data from external API
  let proposal = await getProposalById(id as string);

  const session = await getServerSession(req, res, await authOptions(req, res));
  console.log("print all", id, session?.address);
  let isLiked = false;

  if (session?.address) {
    const user = await getUserByAddress(session.address);
    if (user) {
      let result = await getProposalLiked(user.id, id);
      isLiked = !!result;
    }
  }

  // Pass data to the page via props
  return { props: { _proposal: JSON.stringify(proposal), isLiked } };
};

type VariableState = {
  value: string;
  errorMsg?: string;
};

type VarKeys = {
  title: VariableState;
  content: VariableState;
};

export default function Proposals({
  _proposal,
  isLiked,
}: {
  _proposal: any;
  isLiked: boolean;
}) {
  const { data: sessionData, status } = useSession();
  const [proposal, setProposal] = useState<Proposal>(JSON.parse(_proposal));
  const [title, setTitle] = useState(proposal.title);
  const [content, setContent] = useState(proposal.content);
  const comments = ["TITLE 1", "TITLE 2", "TITLE 3"];
  const [data, setData] = useState<VarKeys>({
    title: {
      value: proposal.title,
      errorMsg: undefined,
    } as VariableState,
    content: {
      value: proposal.content,
      errorMsg: undefined,
    } as VariableState,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let validation = false;
    let errorMsg: string | undefined = undefined;
    switch (name) {
      case "title":
        validation = true;
        break;
      case "content":
        validation = true;
        break;
      default:
        validation = false;
        break;
    }
    console.log(name, value);

    // setVal((v) => value);
    // setTab(nextTab);

    setData((prev) => ({
      ...prev,
      [name]: {
        value,
        errorMsg,
      } as VariableState,
    }));

    console.log("print", data, name, value);
  };

  const router = useRouter();

  async function submit() {
    const obj = {
      proposalId: proposal.id,
      title: data.title.value,
      content: data.content.value,
    };

    await performPOST(
      "/api/proposals/edit",
      JSON.stringify(obj),
      (res: any) => {
        console.log("edit proposal res:", res);
        router.push("/proposals/")
      },
      (err: any) => {
        console.log("edit proposal err:", err);
      }
    );
  }
  // const NoProposal = () => {
  //   return <Typography>No Proposal Found</Typography>;
  // };

  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        <RestrictedPage validAccess={status === "authenticated"}>
          <>
            <h1 className="mb-16 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
              Edit Proposal{" "}
            </h1>
            <form
              className="w-1/2"
              method="POST"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="..."
                  value={data.title.value}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Proposal details
                </label>
                <textarea
                  onChange={handleChange}
                  // style={{width:'80%'}}
                  rows={4}
                  className="block mb-4 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="content"
                  name="content"
                  placeholder="Write your proposal here..."
                  value={data.content.value}
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  // disabled={!canSubmit}
                  type="submit"
                  onClick={submit}
                  className="btn btn-wide"
                >
                  UPDATE
                </button>
              </div>
            </form>
          </>
        </RestrictedPage>
      </Box>
    </main>
  );
}
