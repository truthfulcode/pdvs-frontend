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
  isUserAdmin,
} from "../../../prisma/operations/users/read";
import { updateProposal } from "../../../prisma/operations/proposals/put";
import { updateComment } from "../../../prisma/operations/comments/put";
type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method, body } = req;
  const { commentId, content } = body;
  console.log("body", body);

  async function session() {
    try {
      const session = await getServerSession(
        req,
        res,
        await authOptions(req, res)
      );
      if (session) {
        const u = await getUserByAddress(session.address);
        const result = await updateComment(u ? u.id : "", commentId, content);

        console.log("edit comment", result);

        return res.status(200).json({ message: "success" });
      } else {
        return res.status(401).json({ message: "Invalid Session!" });
      }
    } catch (e) {
      console.log("error", e);
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }

  if (method === "POST") {
    session();
  } else {
    return res.status(405).json({ message: "Method Not Allowed!" });
  }
}
