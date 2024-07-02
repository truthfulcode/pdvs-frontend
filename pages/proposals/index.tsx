// "use client";

import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getProposals } from "../../prisma/operations/proposals/read";
import { formatTime, getProposalColor, stringify } from "@/utils/utils";
import { Proposal } from "@prisma/client";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { PrimaryButton, TimeDisplay } from "@/components/styledElements";

export const getServerSideProps = async () => {
  const proposals = await getProposals();
  // Pass data to the page via props
  return { props: { _proposals: stringify(proposals) } };
};

export default function Proposals({ _proposals }: { _proposals: any }) {
  const { address, isConnected } = useAccount();
  const { status } = useSession();
  const { isAuth } = useAuth();

  const { userType, isAdminOrCM } = useUser();

  const [proposals, setProposals] = useState<Proposal[]>(
    JSON.parse(_proposals)
  );
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (searchText === "") setProposals(JSON.parse(_proposals));
    else {
      //
      setProposals(
        proposals.filter((p) => p.title.toLowerCase().includes(searchText))
      );
    }
  }, [searchText, _proposals, proposals]);

  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        {isAdminOrCM && (
          <Box
            sx={{
              width: "640px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <PrimaryButton
              sx={{ mb: 1 }}
              href="/proposals/create"
            >
              Create Proposal
            </PrimaryButton>
          </Box>
        )}
        <TextField
          sx={{ width: "640px", mb: 2 }}
          id="outlined-basic"
          label="Search Proposal"
          variant="outlined"
          value={searchText}
          onChange={(e) => {
            //
            setSearchText(e.target.value);
          }}
        />
        <List>
          {proposals.map((p, i) => {
            return !(!isAdminOrCM && p.status === "Draft") ? (
              <ListItem
                sx={{
                  border: "3px black solid",
                  borderRadius: 3,
                  mb: 2,
                  pb: 2,
                  background: "#47D2FF11"
                }}
                key={i}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: 600,
                    // maxWidth: 900,
                    minHeight: 150,
                  }}
                >
                  <Box
                    sx={{
                      justifyContent: "space-between",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      {/* Actions */}
                      <IconButton
                        href={"/proposals/view/" + p.id}
                        target="blank"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {isConnected && isAdminOrCM && ["Draft", "Active"].includes(p.status) && (
                        <IconButton
                          href={"/proposals/edit/" + p.id}
                          target="blank"
                        >
                          <EditIcon />
                        </IconButton>
                      )}

                      {p.status === "Published" && (
                        <Tooltip title="View more details on Snapshot">

                          <IconButton
                            href={
                              "https://testnet.snapshot.org/#/persaka.eth/proposal/" +
                              p.proposalIdHash
                            }
                            target="_blank"
                          >
                            <OpenInNewIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    <Typography
                      sx={{
                        color: "white",
                        background: getProposalColor(p.status),
                        p: 0.5,
                        borderRadius: 2,
                        mr: 2,
                        textAlign: "center",
                        minWidth: "80px",
                      }}
                      variant="body2"
                    >
                      {p.status}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography mb={2} variant="h4">
                      {p.title}
                    </Typography>
                    <Typography variant="body2">
                      {p.content.length > 120
                        ? p.content.substring(0, 120) + "..."
                        : p.content}
                    </Typography>
                  </Box>
                  <TimeDisplay
                    variant="body2"
                  >
                    {formatTime(new Date(p.createdAt))}
                  </TimeDisplay>
                </Box>
              </ListItem>
            ) : (
              <></>
            );
          })}
        </List>
      </Box>
    </main>
  );
}
