import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import Web3ModalProvider from "@/context";
import Loading from "@/components/Loading";
import { Alert, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import React, { createContext } from "react";
import { AlertType } from "@/utils/types";

export const GlobalContext = createContext((_msg: string, _msgType: AlertType)=>{});

export default function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState<string>("");
  const [msgType, setMsgType] = React.useState<AlertType>("success");

  const openSnackBar = (_msg: string, _msgType: AlertType) => {
    setMsg(_msg);
    setMsgType(_msgType);
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const theme = createTheme({
    components: {
      MuiTypography: {
        defaultProps: {
          color: "black",
          fontFamily: "sans-serif",
        },
      },
      MuiButtonBase: {
        defaultProps: {
          color: "black",
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Web3ModalProvider>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <Loading>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity={msgType}
                variant="filled"
                sx={{ width: '100%' }}
              >
                {msg}
              </Alert>
            </Snackbar>
            <GlobalContext.Provider value={openSnackBar}>
            <Component {...pageProps} />
            </GlobalContext.Provider>
          </Loading>
        </SessionProvider>
      </Web3ModalProvider>
    </ThemeProvider>
  );
}
