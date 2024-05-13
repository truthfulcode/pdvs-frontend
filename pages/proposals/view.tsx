// "use client";

import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { SnapshotGraphQL } from "@/graphql/SnapshotGraphQL";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

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
  const comments = ["TITLE 1", "TITLE 2", "TITLE 3"];
  const BODY =
    "## 0xE has maliciously denied other team members admin access to Yam's core infrastructure. Multiple services have been lost and discontinued due to 0xE gate keeping of access to these services. 1. Yam's Forum which was the primary discussion point for all Yam improvement proposals. The information that was stored on the forums, many contributors spend months creating are now lost. 2. Yam's Gsuite which includes all contributor email and correspondence. There is possibility that any service that requires a payment will also be discontinued, ie. website hosting and domain name. Snapshot has been approved since Jan 29th 2023 to \"0xE needs to give access to all yam.finance infrastructure to active yam team members that have history of supporting yam.\" https://snapshot.org/#/yam.eth/proposal/0x7e4a82c045f51625d9d707b09214b77f95ad4697ba06aa5ed9737e662afe5eeb Multiple requests have been made and ignored over the past 3 months. ### At this point, it is clear that 0xE has no intentions of allowing other core team members access to the infrastructure to repair the damage that he has done. ## This snapshot is to remove 0xE from the Guardian Multisig and Operations Multisig and any other Yam related infrastructure that we are able to (no others at the moment)";
  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        <Box>
          <Typography mb={2} variant="h4">
            TITLE
          </Typography>
          <Typography mb={2} variant="body2">
            {BODY}
          </Typography>
        </Box>

        <Typography mb={2} variant="h6">
          Comments
        </Typography>
        <TextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disableRipple>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            width: 640,
            mb: 2,
          }}
          multiline
          id="outlined-basic"
          label="Comment"
          variant="outlined"
        />

        <List>
          {comments.map((p, i) => (
            <ListItem
              sx={{ border: "3px black solid", borderRadius: 3, mb: 2 }}
              key={i}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: 600,
                  minHeight: 150,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Typography variant="h6">Rachid</Typography>
                  <Typography ml={2} variant="subtitle2">
                    Replying to Ali
                  </Typography>
                </Box>
                <Typography
                  sx={{ display: "inline-flex", p: 1 }}
                  variant="body2"
                >
                  COMMENT
                </Typography>
                <Typography
                  sx={{ position: "absolute", bottom: 0, left: 0, p: 2 }}
                  variant="body2"
                >
                  Posted At
                </Typography>

                <Box sx={{ position: "absolute", top: 0, right: 0, p: 2 }}>
                  {/* Actions */}
                  <IconButton disableRipple>
                    <DeleteIcon />
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
