import type { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../prisma/operations/users/create";
import { client, walletClient } from "@/utils/utils";
import { ADDRESSES } from "@/utils/constants";
import votingTokenAbi from "../../../src/abi/VotingToken.json";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { AdminVotingToken } from "@/AdminVotingToken";
import {
  getUserByAddress,
  isUserAdmin,
} from "../../../prisma/operations/users/read";
import { createComment } from "../../../prisma/operations/comments/create";
type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const vt = new AdminVotingToken();

  const { method, body } = req;
  console.log("body", body);
  const { proposalId, content } = body;

  async function session() {
    try {
      const session = await getServerSession(
        req,
        res,
        await authOptions(req, res)
      );

      if (session) {
        const user = await getUserByAddress(session.address);

        if (user) {
          const result = await createComment({
            userId: user.id,
            proposalId,
            content,
          });

          console.log("comment result", result);

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
