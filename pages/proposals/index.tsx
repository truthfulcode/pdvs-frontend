// "use client";

import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { SnapshotGraphQL } from "@/graphql/SnapshotGraphQL";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function Proposals() {
  useEffect(() => {
    const snap = new SnapshotGraphQL();
    const getProposals = async () => {
      console.log(await snap.getProposals());
    };

    getProposals().catch((err) => {
      console.log("err proposals", err);
    });
  }, []);
  const proposals = [
    "TITLE 1",
    "TITLE 2",
    "TITLE 3"
  ];
  const BODY =
    "## 0xE has maliciously denied other team members admin access to Yam's core infrastructure. Multiple services have been lost and discontinued due to 0xE gate keeping of access to these services. 1. Yam's Forum which was the primary discussion point for all Yam improvement proposals. The information that was stored on the forums, many contributors spend months creating are now lost. 2. Yam's Gsuite which includes all contributor email and correspondence. There is possibility that any service that requires a payment will also be discontinued, ie. website hosting and domain name. Snapshot has been approved since Jan 29th 2023 to \"0xE needs to give access to all yam.finance infrastructure to active yam team members that have history of supporting yam.\" https://snapshot.org/#/yam.eth/proposal/0x7e4a82c045f51625d9d707b09214b77f95ad4697ba06aa5ed9737e662afe5eeb Multiple requests have been made and ignored over the past 3 months. ### At this point, it is clear that 0xE has no intentions of allowing other core team members access to the infrastructure to repair the damage that he has done. ## This snapshot is to remove 0xE from the Guardian Multisig and Operations Multisig and any other Yam related infrastructure that we are able to (no others at the moment)";
  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        <TextField sx={{width:"640px", mb: 2}} id="outlined-basic" label="Search Proposal" variant="outlined" />
        <List>
          {proposals.map((p, i) => (
            <ListItem
              sx={{ border: "3px black solid", borderRadius: 3, mb: 2 }}
              key={i}
            >
              <Box
                sx={{
                  display: "flex",
                  width: 600,
                  // maxWidth: 900,
                  minHeight: 150,
                }}
              >
                <Box>
                  <Typography mb={2} variant="h4">
                    {p}
                  </Typography>
                  <Typography variant="body2">
                    {BODY.length > 120 ? BODY.substring(0, 120) + "..." : BODY}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    p: 2,
                  }}
                  variant="body2"
                >
                  Published
                </Typography>
                <Typography
                  sx={{ position: "absolute", bottom: 0, right: 0, p: 2 }}
                  variant="body2"
                >
                  Created At
                </Typography>

                <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 2 }}>
                  {/* Actions */}
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton>
                    <OpenInNewIcon />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </main>
  );
}
