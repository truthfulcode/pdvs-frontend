'use client'
import {
  Box,
  makeStyles,
  AppBar,
  Toolbar,
  Paper,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
//

export default function NavBar() {
  //   const useStyle = makeStyles((theme) => ({
  //     actionButton: {
  //       color: "gray",
  //       textAlign: "center",
  //     },
  //     navBar: {},
  //   }));
  //   const classes = useStyle();
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <AppBar position="fixed">
      <Toolbar disableGutters sx={{padding:"0px 16px", backgroundColor:"white"}}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <Image
            style={{}}
            alt="logo"
            src="/vercel.svg"
            height="75"
            width="75"
          />
        </IconButton>
        {/* TODO: add list of links */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Test */}
        </Typography>
        <Button onClick={()=>{ isConnected ? disconnect() : open() }} color="inherit" sx={{color:"black", border:"1.5px solid black"}}>{isConnected ? "Disconnect" : "Connect"}</Button>
      </Toolbar>
    </AppBar>
  );
}
