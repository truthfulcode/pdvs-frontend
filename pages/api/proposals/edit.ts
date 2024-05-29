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
  isUserAdmin,
} from "../../../prisma/operations/users/read";
import { updateProposal } from "../../../prisma/operations/proposals/put";
type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method, body } = req;
  const { proposalId, title, content } = body;
  console.log("body", body);

  async function session() {
    try {
      console.log("add call it");
      // console.log("req",req)
      // const session = await getSession({req})
      const session = await getServerSession(
        req,
        res,
        await authOptions(req, res)
      );
      console.log("START");

      console.log("session:", session);

      if (session) {
        const _isUserAdmin = await isUserAdmin(session.address);
        if (_isUserAdmin) {
          console.log("START_ADMIN");

          const result = await updateProposal(proposalId, { title, content });

          console.log("edit proposal", result);

          return res.status(200).json({ message: "success!" });
        } else {
          return res.status(401).json({ message: "Unauthorized Access!" });
        }
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
