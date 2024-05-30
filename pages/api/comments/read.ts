import type { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../prisma/operations/users/create";
import { client, walletClient } from "@/utils/utils";
import { ADDRESSES } from "@/utils/constants";
import votingTokenAbi from "../../../src/abi/VotingToken.json";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { AdminVotingToken } from "@/AdminVotingToken";
import { createProposal } from "../../../prisma/operations/proposals/create";
import {
  getUserByAddress,
  getUserById,
  isUserAdmin,
} from "../../../prisma/operations/users/read";
import { updateProposal } from "../../../prisma/operations/proposals/put";
import { updateComment } from "../../../prisma/operations/comments/put";
import { getProposalById } from "../../../prisma/operations/proposals/read";
import { getProposalComments } from "../../../prisma/operations/comments/read";
import { Comment } from "@prisma/client";
type ResponseData = {
  message: string;
  data: Object;
};

type CustomComment = Comment & {
  username: string;
  userType: string;
  isEditable: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method, query } = req;
  const { proposalId } = query;
  console.log("query", query);

  const session = await getServerSession(req, res, await authOptions(req, res));

  if (method === "GET") {
    try {
      console.log("querying");
      let comments: Comment[] = [];
      const p = await getProposalById(proposalId as string);
      if (p) {
        comments = await getProposalComments(p.id);
      }

      let comments1: CustomComment[] = [];

      for (let c of comments) {
        let c1: CustomComment = c as CustomComment;
        const u = await getUserById(c.authorId);
        c1.username = u ? u.fullName : "";
        c1.userType = u ? u.userType : "";
        const address = session?.address;
        if (address) {
          const u = await getUserByAddress(address);
          if (u) c1.isEditable = c1.authorId === u.id;
          else c1.isEditable = false;
        } else {
          c1.isEditable = false;
        }
        console.log("looping", c1);
        comments1.push(c1);
      }

      console.log("returning");
      return res.status(200).json({ message: "success", data: { comments: comments1 } });
    } catch (e) {
      console.log("error", e);
      return res
        .status(500)
        .json({ message: "Something went wrong!", data: {} });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed!", data: {} });
  }
}
