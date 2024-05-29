// "use client";

import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SnapshotGraphQL } from "@/snapshot/graphql/SnapshotGraphQL";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getProposals } from "../../prisma/operations/proposals/read";
import { formatTime } from "@/utils/utils";
import { Proposal } from "@prisma/client";

export const getServerSideProps = async () => {
  const proposals = await getProposals(1);

  // Pass data to the page via props
  return { props: { _proposals: JSON.stringify(proposals) } };
};

export default function Proposals({ _proposals }: { _proposals: any }) {
  const [proposals, setProposals] = useState<Proposal[]>(
    JSON.parse(_proposals)
  );
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const snap = new SnapshotGraphQL();
    const getProposals = async () => {
      console.log(await snap.getProposals());
    };

    getProposals().catch((err) => {
      console.log("err proposals", err);
    });
  }, []);

  useEffect(() => {
    if (searchText === "") setProposals(JSON.parse(_proposals));
    else {
      //
      setProposals(
        proposals.filter((p) => p.title.toLowerCase().includes(searchText))
      );
    }
  }, [searchText]);
  // const proposals = ["TITLE 1", "TITLE 2", "TITLE 3"];
  const BODY =
    "## 0xE has maliciously denied other team members admin access to Yam's core infrastructure. Multiple services have been lost and discontinued due to 0xE gate keeping of access to these services. 1. Yam's Forum which was the primary discussion point for all Yam improvement proposals. The information that was stored on the forums, many contributors spend months creating are now lost. 2. Yam's Gsuite which includes all contributor email and correspondence. There is possibility that any service that requires a payment will also be discontinued, ie. website hosting and domain name. Snapshot has been approved since Jan 29th 2023 to \"0xE needs to give access to all yam.finance infrastructure to active yam team members that have history of supporting yam.\" https://snapshot.org/#/yam.eth/proposal/0x7e4a82c045f51625d9d707b09214b77f95ad4697ba06aa5ed9737e662afe5eeb Multiple requests have been made and ignored over the past 3 months. ### At this point, it is clear that 0xE has no intentions of allowing other core team members access to the infrastructure to repair the damage that he has done. ## This snapshot is to remove 0xE from the Guardian Multisig and Operations Multisig and any other Yam related infrastructure that we are able to (no others at the moment)";
  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        <Button href="/proposals/create">Create Proposal</Button>
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
          {proposals.map((p, i) => (
            <ListItem
              sx={{ border: "3px black solid", borderRadius: 3, mb: 2, pb: 2 }}
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
                    {p.status === "Draft" && (
                      <IconButton
                        href={"/proposals/edit/" + p.id}
                        target="blank"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton href={"/proposals/view/" + p.id} target="blank">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton>
                      <OpenInNewIcon />
                    </IconButton>
                  </Box>

                  <Typography mr={2} variant="body2">
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

                <Typography
                  // sx={{ position: "absolute", bottom: 0, right: 0, p: 2 }}
                  variant="body2"
                >
                  {formatTime(new Date(p.createdAt))}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </main>
  );
}
