import type { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../prisma/operations/users/create";
import { client, walletClient } from "@/utils/utils";
import { ADDRESSES } from "@/utils/constants";
import votingTokenAbi from "../../../src/abi/VotingToken.json";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { AdminVotingToken } from "@/AdminVotingToken";
import { isUserAdmin } from "../../../prisma/operations/users/read";
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
  const { userType, userAddress, matricNumber, cgpa, fullName } = body;

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
      //   {
      //   req: req,
      // });

      console.log("START");

      console.log("session:", session);

      if (session) {
        const _isUserAdmin = await isUserAdmin(session.address);

        if (_isUserAdmin) {
          console.log("START_ADMIN");
          // braodcast the transaction to the blockchain

          const castedCgpa = Number((cgpa * 100).toFixed(0));

          const simulation = await vt.simulate("mint", [
            userAddress,
            castedCgpa,
            userType === "CM" ? 2 : 1,
          ]);

          // TODO register the user
          const result = await createUser({
            userType,
            userAddress,
            matricNumber,
            cgpa: castedCgpa,
            fullName,
          });

          console.log("create user", result);

          await vt.execute(simulation.request);

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
