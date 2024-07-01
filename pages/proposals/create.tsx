"use client";

import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import { useAccount } from "wagmi";
import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Proposal } from "@/utils/types";
import { performBriefPOST, performPOST } from "@/utils/httpRequest";
import RestrictedPage from "@/components/RestrictedPage";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

const styling = {
  row: { display: "flex", flexDirection: "row" },
  column: { display: "flex", flexDirection: "column" },
};

type VariableState = {
  value: string;
  errorMsg?: string;
};

const defaultValue = {
  value: "",
  errorMsg: undefined,
} as VariableState;

type VarKeys = {
  title: VariableState;
  content: VariableState;
};

export default function Home() {
  const { address } = useAccount();
  const { data: sessionData, status, update } = useSession();
  const { isAuth } = useAuth();
  const [canSubmit, setCanSubmit] = useState(false)
  const [data, setData] = useState<VarKeys>({
    title: defaultValue,
    content: defaultValue,
  });

  const handleRegistration = (e: any) => {
    e.preventDefault();
  };

  const handleChange = useCallback((e: any) => {

    const { name, value } = e.target;
    let validation = false;
    let errorMsg: string | undefined = undefined;
    switch (name) {
      case "title":
        validation = (value as string).length > 0;
        if (!validation) errorMsg = "Empty title!";
        break;
      case "content":
        validation = (value as string).length > 0;
        if (!validation) errorMsg = "Empty content!";
        break;
      default:
        validation = false;
        break;
    }

    setData((prev) => ({
      ...prev,
      [name]: {
        value,
        errorMsg,
      } as VariableState,
    }));
  }, []);

  useEffect(() => {
    const isValid = Object.values(data).every(
      (field) => field.value !== "" && field.errorMsg === undefined
    );
    setCanSubmit(isValid);
  }, [data]);

  const router = useRouter();

  async function submit() {
    const obj: Proposal = {
      content: data.content.value,
      title: data.title.value,
    };

    await performPOST(
      "/api/proposals/create",
      JSON.stringify(obj),
      (res: any) => {
        console.log("create proposal res:", res);
        router.push("/proposals/");
      },
      (err: any) => {
        console.log("create proposal err:", err);
      }
    );
  }

  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        <RestrictedPage validAccess={!!isAuth}>
          <>
            <h1 className="mb-16 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl ">
              Create New Proposal{" "}
            </h1>
            <form className="w-1/2" method="POST" onSubmit={handleRegistration}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="..."
                  value={data.title.value}
                />
                {data.title.errorMsg && <p className="text-sm text-red-500 ">{data.title.errorMsg}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Proposal details
                </label>
                <textarea
                  onChange={handleChange}
                  rows={4}
                  className="block mb-4 p-2.5 w-full text-sm text-black bg-white rounded-lg border border-gray-300"
                  id="content"
                  name="content"
                  placeholder="Write your proposal here..."
                  value={data.content.value}
                ></textarea>
                {data.content.errorMsg && <p className="text-sm text-red-500 ">{data.content.errorMsg}</p>}
              </div>
              <div className="flex justify-center">
                <button
                  disabled={!canSubmit}
                  type="submit"
                  onClick={submit}
                  className="btn disabled:bg-slate-50 btn-wide bg-white text-black hover:bg-slate-200"
                >
                  CREATE
                </button>
              </div>
            </form>
          </>
        </RestrictedPage>
      </Box>
    </main>
  );
}
