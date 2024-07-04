import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/utils/utils";
import { ADDRESSES } from "@/utils/constants";
import deleteUser from "../../../prisma/operations/users/delete";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import votingTokenAbi from "../../../src/abi/VotingToken.json";
import {
  getUserById,
  isUserAdmin,
} from "../../../prisma/operations/users/read";
import { account } from "@/utils/restrictedUtils";
import { AdminVotingToken } from "@/AdminVotingToken";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string;
  }>
) {

  const vt = new AdminVotingToken();

  const { method, body } = req;
  const { userId } = body;

  async function session() {
    try {
      const session = await getServerSession(
        req,
        res,
        await authOptions(req, res)
      );

      if (session) {
        const _isUserAdmin = await isUserAdmin(session.address);

        if (_isUserAdmin) {
          const user = await getUserById(userId);

          if (user) {
            let simulation;
            // braodcast the transaction to the blockchain
            try {
              simulation = await client.simulateContract({
                account: account,
                abi: votingTokenAbi.abi,
                address: ADDRESSES.tokenAddress,
                functionName: "revoke",
                args: [user.userAddress],
              });
            } catch (err) {
              return res.status(401).json({message: "Failed to broadcast revoke user cgpa to the blockchain"})
            }

            await deleteUser(userId);

          await vt.execute(simulation?.request);

          }

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
