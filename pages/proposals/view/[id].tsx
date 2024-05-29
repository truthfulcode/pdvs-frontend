// "use client";

import styles from "../../../styles/page.module.css";
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
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { SnapshotGraphQL } from "@/snapshot/graphql/SnapshotGraphQL";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useRouter } from "next/router";
import { Comment, Proposal } from "@prisma/client";
import { performBriefPOST } from "@/utils/httpRequest";
import { getProposalLiked } from "../../../prisma/operations/proposals/put";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getUserByAddress } from "../../../prisma/operations/users/read";
import { getProposalById } from "../../../prisma/operations/proposals/read";
import { getProposalComments } from "../../../prisma/operations/comments/read";
import { formatTime } from "@/utils/utils";

export const getServerSideProps = async ({ params, req, res }) => {
  const { id } = params;

  // Fetch data from external API
  let proposal = await getProposalById(id as string);

  let comments: Comment[] | null = [];
  if (proposal) {
    comments = await getProposalComments(id);
  }

  const session = await getServerSession(req, res, await authOptions(req, res));
  console.log("print all", id, session?.address);
  let isLiked = false;

  if (session?.address) {
    const user = await getUserByAddress(session.address);
    if (user) {
      let result = await getProposalLiked(user.id, id);
      isLiked = !!result;
    }
  }

  // Pass data to the page via props
  return {
    props: {
      _proposal: JSON.stringify(proposal),
      isLiked,
      _comments: JSON.stringify(comments),
    },
  };
};

export default function Proposals({
  _proposal,
  isLiked,
  _comments,
}: {
  _proposal: any;
  _comments: any;
  isLiked: boolean;
}) {
  const [proposal, setProposal] = useState<Proposal>(JSON.parse(_proposal));
  const comments = JSON.parse(_comments) as Comment[];
  // const comments = ["TITLE 1", "TITLE 2", "TITLE 3"];
  const BODY =
    "## 0xE has maliciously denied other team members admin access to Yam's core infrastructure. Multiple services have been lost and discontinued due to 0xE gate keeping of access to these services. 1. Yam's Forum which was the primary discussion point for all Yam improvement proposals. The information that was stored on the forums, many contributors spend months creating are now lost. 2. Yam's Gsuite which includes all contributor email and correspondence. There is possibility that any service that requires a payment will also be discontinued, ie. website hosting and domain name. Snapshot has been approved since Jan 29th 2023 to \"0xE needs to give access to all yam.finance infrastructure to active yam team members that have history of supporting yam.\" https://snapshot.org/#/yam.eth/proposal/0x7e4a82c045f51625d9d707b09214b77f95ad4697ba06aa5ed9737e662afe5eeb Multiple requests have been made and ignored over the past 3 months. ### At this point, it is clear that 0xE has no intentions of allowing other core team members access to the infrastructure to repair the damage that he has done. ## This snapshot is to remove 0xE from the Guardian Multisig and Operations Multisig and any other Yam related infrastructure that we are able to (no others at the moment)";
  console.log("comments", _comments);
  const ProposalDetails = () => {
    const [liked, setLiked] = useState(isLiked);

    const submitLike = async () => {
      await performBriefPOST(
        "/api/proposals/like",
        JSON.stringify({
          proposalId: proposal.id,
        }),
        "like proposal"
      );
    };

    const Like = () => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <IconButton
          onClick={async () => {
            setLiked(!liked);
            await submitLike();
          }}
          disableRipple
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography mb={1}>
          {isLiked
            ? proposal.likesCount - (liked ? 0 : 1)
            : proposal.likesCount + (liked ? 1 : 0)}
        </Typography>
      </Box>
    );
    return (
      <>
        <Box sx={{ border: "black solid 3px", borderRadius: 3, p: 2, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography mb={2} variant="h4">
              {proposal.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography>Active</Typography>
              <Like />
            </Box>
          </Box>
          <Typography mb={2} variant="body2">
            {proposal.content}
          </Typography>
          <Typography mb={2} variant="body2">
            Updated 1hr ago
          </Typography>
        </Box>

        {/* Comment Section */}
        <Box>
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
            {comments.map((c, i) => (
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
                  </Box>
                  <Typography
                    sx={{ display: "inline-flex", p: 1 }}
                    variant="body2"
                  >
                    {c.content}
                  </Typography>
                  <Typography
                    sx={{ position: "absolute", bottom: 0, left: 0, p: 2 }}
                    variant="body2"
                  >
                    {formatTime(new Date(c.createdAt))}
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
      </>
    );
  };
  const NoProposal = () => {
    return <Typography>No Proposal Found</Typography>;
  };

  //   useEffect(() => {
  //     const snap = new SnapshotGraphQL();
  //     const getProposals = async () => {
  //       console.log(await snap.getProposals());
  //     };

  //     getProposals().catch((err) => {
  //       console.log("err proposals", err);
  //     });
  //   }, []);

  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        {proposal ? <ProposalDetails /> : <NoProposal />}
      </Box>
    </main>
  );
}
