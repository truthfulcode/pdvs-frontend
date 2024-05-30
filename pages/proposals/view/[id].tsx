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
import EditIcon from "@mui/icons-material/Edit";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { SnapshotGraphQL } from "@/snapshot/graphql/SnapshotGraphQL";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useRouter } from "next/router";
import { Comment, Proposal } from "@prisma/client";
import { performBriefPOST, performGET, performPOST } from "@/utils/httpRequest";
import { getProposalLiked } from "../../../prisma/operations/proposals/put";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import {
  getUserByAddress,
  getUserById,
} from "../../../prisma/operations/users/read";
import { getProposalById } from "../../../prisma/operations/proposals/read";
import { getProposalComments } from "../../../prisma/operations/comments/read";
import { formatTime } from "@/utils/utils";
import SaveAsIcon from "@mui/icons-material/SaveAs";

type CustomComment = Comment & {
  username: string;
  userType: string;
  isEditable: boolean;
};

export const getServerSideProps = async ({ params, req, res }) => {
  const { id } = params;

  // Fetch data from external API
  let proposal = await getProposalById(id as string);

  const session = await getServerSession(req, res, await authOptions(req, res));
  let isLiked = false;

  let isAdmin = false;
  if (session?.address) {
    const user = await getUserByAddress(session.address);
    isAdmin = user?.userType === "ADMIN";
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
      isAdmin,
    },
  };
};

export default function Proposals({
  _proposal,
  isLiked,
  isAdmin,
}: {
  _proposal: any;
  isLiked: boolean;
  isAdmin: boolean;
}) {
  const [proposal, setProposal] = useState<Proposal>(JSON.parse(_proposal));
  const [comments, setComments] = useState<CustomComment[]>([]);

  async function queryComments() {
    const obj = new URLSearchParams({
      proposalId: proposal.id,
    });

    await performGET(
      "/api/comments/read",
      obj,
      (res: any) => {
        console.log("read proposal res", res);
        let result = res.data.comments;
        if (result) setComments(res.data.comments);
        console.log("comments data", res.data.comments);
      },
      (err: any) => {
        console.log("read proposal err", err);
      }
    );
  }
  useEffect(() => {
    queryComments();
  }, []);
  const isEditable = (createdAt: Date) => {
    let expirationAtTime = new Date(createdAt).getTime() + 10 * 60 * 1000;
    let now = new Date().getTime();
    console.log("time", createdAt, now);
    return now <= expirationAtTime;
  };
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
    const [comment, setComment] = useState("");
    const submit = async () => {
      const obj = {
        proposalId: proposal.id,
        content: comment,
      };

      await performPOST(
        "/api/comments/create",
        JSON.stringify(obj),
        (res: any) => {
          console.log("create comment res:", res);
          location.reload();
        },
        (err: any) => {
          console.log("create comment err:", err);
        }
      );
    };

    const [commentIdEditing, setCommentIdEditing] = useState("");
    const [commentContentEditing, setCommentContentEditing] = useState("");

    const saveSubmit = async (commentId: string) => {
      const obj = {
        commentId: commentIdEditing,
        content: commentContentEditing,
      };

      await performPOST(
        "/api/comments/edit",
        JSON.stringify(obj),
        (res: any) => {
          console.log("edit comment res:", res);
          location.reload();
        },
        (err: any) => {
          console.log("edit comment err:", err);
        }
      );
    };

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
                  <IconButton onClick={submit}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mt: 2,
              width: "640px",
              mb: 2,
            }}
            multiline
            id="outlined-basic"
            label="Comment"
            variant="outlined"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
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
                    <Typography variant="h6">{c.username}</Typography>
                    <Typography
                      variant="subtitle2"
                      ml={1}
                      sx={{
                        background: () => {
                          switch (c.userType) {
                            case "STUDENT":
                              return "blue";
                            case "CM":
                              return "yellow";
                            default:
                              return "red";
                          }
                        },
                        borderRadius: 3,
                        p: "2px 4px",
                      }}
                    >
                      {c.userType}
                    </Typography>
                  </Box>
                  {c.id !== commentIdEditing ? (
                    <Typography
                      sx={{ display: "inline-flex", p: 1 }}
                      variant="body2"
                    >
                      {c.content}
                    </Typography>
                  ) : (
                    <TextField
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                saveSubmit(c.id);
                                setCommentIdEditing("");
                                setCommentContentEditing("");
                              }}
                            >
                              <SaveAsIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mt: 2,
                        width: "auto",
                        mb: 2,
                      }}
                      multiline
                      id="outlined-basic"
                      label="Comment"
                      variant="outlined"
                      value={commentContentEditing}
                      onChange={(e) => {
                        setCommentContentEditing(e.target.value);
                      }}
                    />
                  )}
                  <Typography
                    sx={{ position: "absolute", bottom: 0, right: 0, p: 2 }}
                    variant="body2"
                  >
                    {formatTime(new Date(c.createdAt))}
                  </Typography>

                  <Box sx={{ position: "absolute", top: 0, right: 0, p: 2 }}>
                    {/* Actions */}
                    {c.isEditable && isEditable(c.createdAt) && (
                      <IconButton
                        onClick={() => {
                          setCommentIdEditing(c.id);
                          setCommentContentEditing(c.content);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {isAdmin && (
                      <IconButton
                        disableRipple
                        onClick={async () => {
                          const obj = { commentId: c.id };
                          await performPOST(
                            "/api/comments/delete",
                            JSON.stringify(obj),
                            (res: any) => {
                              console.log("delete comment res:", res);
                              location.reload();
                            },
                            (err: any) => {
                              console.log("delete comment err:", err);
                            }
                          );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
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
