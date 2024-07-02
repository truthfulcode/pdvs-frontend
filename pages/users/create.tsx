"use client";

import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import { useBalance } from "wagmi";
import { Box, Tooltip } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { isAddress } from "viem";
import { User } from "@/utils/types";
import { UserType } from "@prisma/client";
import { performBriefPOST, performPOST } from "@/utils/httpRequest";
import RestrictedPage from "@/components/RestrictedPage";
import { ADDRESSES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { GlobalContext } from "../_app";
import { isMobile } from 'react-device-detect';
import Head from "next/head";

type VariableState = {
  value: string;
  errorMsg?: string;
};

const defaultValue = {
  value: "",
  errorMsg: undefined,
} as VariableState;

type varKeys = "address" | "matricNumber" | "cgpa" | "userType";
const userTypes = ["STUDENT", "CM"];
type VarKeys = {
  address: VariableState;
  matricNumber: VariableState;
  cgpa: VariableState;
  userType: VariableState;
  fullName: VariableState;
};

export default function Home() {
  const { data: balance } = useBalance({ address: ADDRESSES.keeper });
  const [canSubmit, setCanSubmit] = useState(false)
  const { isAuth } = useAuth();
  const openSnackBar = useContext(GlobalContext)

  const [data, setData] = useState<VarKeys>({
    address: defaultValue,
    matricNumber: defaultValue,
    cgpa: defaultValue,
    userType: {
      value: "STUDENT",
      errorMsg: undefined,
    },
    fullName: defaultValue,
  });

  const handleRegistration = (e: any) => {
    e.preventDefault();
  };

  console.log("data", data)

  const handleChange = useCallback((e: any) => {
    const { name, value } = e.target;
    let validation = false;
    let errorMsg: string | undefined = undefined;

    switch (name) {
      case "address":
        validation = isAddress(value);
        if (!validation) errorMsg = "Invalid address!";
        break;
      case "fullName":
        validation = (value as string).length > 0;
        if (!validation) errorMsg = "Empty full name!";
        break;
      case "matricNumber":
        validation = (value as string).length > 0;
        if (!validation) errorMsg = "Empty matric number!";
        break;
      case "cgpa":
        validation = value && value !== "" && (value >= 0 && value <= 4);
        if (!validation) errorMsg = "Invalid cgpa";
        break;
      case "userType":
        validation = userTypes.includes(value);
        if (!validation) errorMsg = "Invalid UserType";
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
    const userObj: User = {
      cgpa: Number(data.cgpa.value),
      fullName: data.fullName.value,
      userType: data.userType.value as UserType,
      userAddress: data.address.value,
      matricNumber: data.matricNumber.value,
    };

    await performPOST(
      "/api/users/create",
      JSON.stringify(userObj),
      (res: any) => {
        router.push("/users/");
        openSnackBar("User added!", "success")
      },
      (err: any) => {
        const { message } = err;
        openSnackBar(message, "error")
      }
    );
  }

  return (
    <main>
      <Head>
        <title>Create User</title>
        <meta name="description" content="Admin page, used to create new students proposals." />
      </Head>

      <NavBar />
      <Box
        className={isMobile ? "mx-12 my-8" : styles.main}
      >
        <RestrictedPage validAccess={!!isAuth}>
          <>
            <h1 className="mb-16 text-4xl font-extrabold leading-none tracking-tight text-center text-gray-900 md:text-4xl lg:text-5xl">
              Create New User{" "}
            </h1>
            <form method="POST" onSubmit={handleRegistration}>
              <label className="text-gray-700 font-bold flex justify-center">
                Keeper:
              </label>
              <div className="mb-4 flex justify-between">
                <Tooltip title="Keeper is the address used to register users in the server">
                  <label className="text-gray-700 font-bold">
                    Address
                  </label>
                </Tooltip>
                <button onClick={() => {
                  navigator.clipboard.writeText(ADDRESSES.keeper);
                }} type="button" className="js-clipboard-example p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800" data-clipboard-target="#hs-clipboard-basic" data-clipboard-action="copy" data-clipboard-success-text="Copied">
                  <svg className="js-clipboard-default size-4 group-hover:rotate-6 transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  </svg>

                  <svg className="js-clipboard-success hidden size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              </div>

              <div className="mb-4 flex justify-between">
                <Tooltip title="Keeper is the address used to register users in the server">
                  <label className="text-gray-700 font-bold">
                    Balance
                  </label>
                </Tooltip>
                <label className="text-gray-700 font-bold">
                  {balance ? Number(balance.formatted).toFixed(4) : 0} tBNB
                </label>
              </div>


              <label className="text-gray-700 font-bold flex justify-center">
                User Info:
              </label>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="..."
                  value={data.fullName.value}
                />
                {data.fullName.errorMsg && <p className="text-sm text-red-500 ">{data.fullName.errorMsg}</p>}

              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Addresss
                </label>
                <input
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  name="address"
                  type="text"
                  placeholder="0x..."
                  value={data.address.value}
                />
                {data.address.errorMsg && <p className="text-sm text-red-500 ">{data.address.errorMsg}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Matric Number
                </label>
                <input
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                  id="matricNumber"
                  name="matricNumber"
                  type="text"
                  placeholder="A23..."
                  value={data.matricNumber.value}
                />
                {data.matricNumber.errorMsg && <p className="text-sm text-red-500 ">{data.matricNumber.errorMsg}</p>}
              </div>

              <div className="max-w-lg w-58 mx-auto mb-4">
                <label
                  htmlFor="number-input"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Enter CGPA
                </label>
                <input
                  type="number"
                  id="number-input"
                  min="0"
                  max="4"
                  step="0.01"
                  defaultValue="2.00"
                  aria-describedby="helper-text-explanation"
                  className="bg-white text-black border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="3.89"
                  name="cgpa"
                  required
                  value={data.cgpa.value}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    let _value = value;

                    if (Number(value) > 4) {
                      _value = "4";
                    } else if (Number(value) < 0) {
                      _value = "0";
                    }

                    setData((prev) => ({
                      ...prev,
                      [name]: {
                        value: _value,
                        errorMsg: undefined,
                      } as VariableState,
                    }));
                  }}
                />
                {data.cgpa.errorMsg && <p className="text-sm text-red-500 ">{data.cgpa.errorMsg}</p>}
              </div>

              <div className="mb-4 w-52 m-auto">
                <label
                  htmlFor="number-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select User Type:
                </label>
                <div className="flex">
                  {userTypes.map((o, i) => (
                    <div key={i} className="inline-flex items-center">
                      <label
                        className="relative flex items-center p-3 rounded-full cursor-pointer"
                        htmlFor="html"
                      >
                        <input
                          onChange={handleChange}
                          defaultChecked={i === 0}
                          name="userType"
                          type="radio"
                          value={o}
                          className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                          id="html"
                        />
                        <span className="absolute text-gray-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <circle
                              data-name="ellipse"
                              cx="8"
                              cy="8"
                              r="8"
                            ></circle>
                          </svg>
                        </span>
                      </label>
                      <label
                        className="mt-px  cursor-pointer select-none text-gray-700 text-sm font-bold"
                        htmlFor="html"
                      >
                        {o}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button
                disabled={!canSubmit}
                type="submit"
                onClick={submit}
                className="btn m-auto disabled:bg-slate-50 btn-wide bg-white text-black hover:bg-slate-200"
              >
                REGISTER
              </button>
            </form>
          </>
        </RestrictedPage>
      </Box>
    </main>
  );
}
