import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import createUser from "../../../prisma/operations/users/create";
import { account, client, walletClient } from "@/utils/utils";
import { ADDRESSES } from "@/utils/constants";
import erc20Abi from "../../../src/abi/ERC20.json";
import deleteUser from "../../../prisma/operations/users/delete";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import votingTokenAbi from "../../../src/abi/VotingToken.json";
import { getUserById } from "../../../prisma/operations/users/read";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const ADMIN = ADDRESSES.admin;
  const { method, body } = req;
  const { userId } = body;

  async function session() {
    try {
      console.log("call it");
      const session = await getServerSession(
        req,
        res,
        await authOptions(req, res)
      );

      //   {
      //   req: req,
      // });

      console.log("session:", session);

      if (session) {
        if (session.address === ADMIN) {
          const user = await getUserById(userId);

          if (user) {
            // braodcast the transaction to the blockchain
            const { request, result: output } = await client.simulateContract({
              account: account,
              abi: votingTokenAbi.abi,
              address: ADDRESSES.tokenAddress,
              functionName: "revoke",
              args: [user.userAddress],
            });

            // TODO register the user
            const result = await deleteUser(userId);

            console.log("delete user", result);
          }

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
