"use client";

import Image from "next/image";
import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import { useAccount } from "wagmi";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { isAddress } from "viem";

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

enum UserType {
  STUDENT,
  CM,
}
type varKeys = "address" | "matricNumber" | "cgpa" | "userType";
const userTypes = ["Student", "Comittee Member"];
type VarKeys = {
  address: VariableState;
  matricNumber: VariableState;
  cgpa: VariableState;
  userType: VariableState;
};

export default function Home() {
  const { address } = useAccount();

  const [data, setData] = useState<VarKeys>({
    address: defaultValue,
    matricNumber: defaultValue,
    cgpa: defaultValue,
    userType: defaultValue,
  });

  const [val, setVal] = useState("");

  const handleRegistration = (e) => {
    e.preventDefault();

    console.log(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let validation = false;
    let errorMsg: string | undefined = undefined;
    switch (name) {
      case "address":
        validation = isAddress(value); // TODO
        if (!validation) errorMsg = "Invalid address!";
        break;
      case "matricNumber":
        validation = true; // TODO
        // if () errorMsg = "" ;
        break;
      case "cgpa":
        validation = true; // TODO
        // if () errorMsg = "" ;
        break;
      case "userType":
        validation = userTypes.includes(value); // TODO
        if (!validation) errorMsg = "Invalid UserType";
        break;
      default:
        validation = false;
        break;
    }

    // const obj = Object.assign({}, data) as VarKeys;
    // obj[name as varKeys] = {
    //   value,
    //   errorMsg,
    // };

    // setData(obj);

    // let _data = data;

    // setData((account) => ({
    //   ...account,
    //   [name]: { value: value, errorMsg: errorMsg },
    // }));

    // setData({
    //   ...data,
    //   [e.target.name]: { value: e.target.value, errorMsg: undefined },
    // });

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

  // Destructure data
  const { ...allData } = data;

  // Disable submit button until all fields are filled in
  const canSubmit = [...Object.values(allData)].every((v) => !v.errorMsg);

  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        <h1 className="mb-16 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          Create New User{" "}
        </h1>
        <form method="POST" onSubmit={handleRegistration}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Addresss
            </label>
            <input
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              name="address"
              type="text"
              placeholder="0x..."
              value={data.address.value}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Matric Number
            </label>
            <input
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="matricNumber"
              name="matricNumber"
              type="text"
              placeholder="A23..."
              value={data.matricNumber.value}
            />
          </div>

          <div className="max-w-lg w-58 mx-auto mb-4">
            <label
              htmlFor="number-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Enter CGPA:
            </label>
            <input
              type="number"
              id="number-input"
              min="0"
              max="4"
              step="0.01"
              defaultValue="2.00"
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="90210"
              required
            />
          </div>

          <div className="mb-4 w-52">
            <label
              htmlFor="number-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select User Type:
            </label>
            <div className="flex">
              {userTypes.map((o, i) => (
                <div className="inline-flex items-center">
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
                    className="mt-px font-light text-gray-700 cursor-pointer select-none"
                    htmlFor="html"
                  >
                    {o}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button disabled={!canSubmit} type="submit" className="btn btn-wide">
            Register
          </button>
        </form>
      </Box>
    </main>
  );
}
