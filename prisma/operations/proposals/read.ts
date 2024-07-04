import { prisma } from "../../../src/utils/prisma";

export async function getProposalById(id: string) {
  return await prisma.proposal.findFirst({
    where: {
      id,
    },
  });
}

export async function getProposals() {
  const result = await prisma.proposal.findMany({});

  return result ?? null;
}