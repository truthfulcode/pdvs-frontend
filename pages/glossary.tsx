// "use client";
import NavBar from "@/components/NavBar";
import { Box, List, ListItem, Typography } from "@mui/material";
import { useAccount } from "wagmi";
import styles from "../styles/page.module.css";
import Head from "next/head";

const list = [{ t: "CM", c: "Committee Member" }, { t: "VP", c: "Voting Power" }, { t: "Block Snapshot", c: "Block number at which the proposal voting power would be retrieved from, thinking of it like freezing time in the past, using the voting power of that time." }]
export default function Home() {
  return (

    <Box>
      <Head>
        <title>Platform Glossary</title>
        <meta name="description" content=
          "Learn about key terms, concepts, and how the platform works. This glossary is your guide to navigating the UTM PERSAKA Voting Platform." />
      </Head>

      <main>
        <NavBar />
        <Box sx={{
          p: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", margin: "auto" }}>Glossary</Typography>
          <List>
            {list.map(l => (
              <ListItem sx={{ display: "flex" }}>
                <Typography sx={{ flex: 1, fontWeight: "bold" }}>
                  {l.t}:
                </Typography>
                <Typography sx={{ flex: 5 }}>
                  {l.c}:
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </main>
    </Box>

  );
}
