import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import createUser from "../../../prisma/operations/users/create";
import { client, walletClient } from "@/utils/utils";
import { ADDRESSES } from "@/utils/constants";
import erc20Abi from "../../../src/abi/ERC20.json";
import deleteUser from "../../../prisma/operations/users/delete";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import votingTokenAbi from "../../../src/abi/VotingToken.json";
import {
  getUserByAddress,
  getUserById,
  isUserAdmin,
} from "../../../prisma/operations/users/read";
import { account } from "@/utils/restrictedUtils";
import deleteComment from "../../../prisma/operations/comments/delete";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method, body } = req;
  const { commentId } = body;

  async function session() {
    try {
      console.log("call it");
      const session = await getServerSession(
        req,
        res,
        await authOptions(req, res)
      );

      if (session) {
        const _isUserAdmin = await isUserAdmin(session.address);

        if (_isUserAdmin) {
          const result = await deleteComment(commentId);
          console.log("result", result);

          return res.status(200).json({ message: "success" });
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
