// "use client";

import NavBar from "@/components/NavBar";
import { useUser } from "@/hooks/useUser";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { isMobile } from "react-device-detect";

export default function Home() {
  const { userType, fullName } = useUser();

  return (
    <Box sx={{ height: "100vh" }}>
      <Head>
        <title>UTM PERSAKA Voting Platform: Your Voice Matters</title>
        <meta name="description" content=
          "Welcome to the UTM PERSAKA Voting Platform, where School of Computing students can have a direct say in shaping the future of our community. Vote on proposals, discuss ideas, and make your voice heard!" />
      </Head>
      <NavBar />
      {isMobile && userType !== "ADMIN" &&
        (
          <Box>
            <Typography sx={{
              fontWeight: "bold",
              mt: 2,
              textAlign: "center"
            }}>Welcome {fullName}!</Typography>
          </Box>
        )
      }
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          p: "32px 96px",
          m: 6,
          background: "#A7E6FF",
          borderRadius: 3,
        }}
      >
        <Box>
          <Typography variant="h3">Persaka DAO Voting System</Typography>
          <Typography maxWidth="500px" variant="body1">
            Persaka Voting DAO System, A platform made for FC students, to
            participate on on-going discussions, vote, and transparently track
            the voting progress.
          </Typography>
        </Box>
        <Box>
          <Image
            src="/voting.png"
            width={500}
            height={500}
            layout="fixed"
            objectFit="contain"
            alt=""
          />
        </Box>
      </Box>
    </Box>
  );
}
