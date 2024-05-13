import { User } from "@/utils/types";
import { prisma } from "../../../src/utils/prisma";

// ------
export async function getUserById(id: number): Promise<User | null> {
  let result = await prisma.user.findFirst({
    where: {
      id,
    },
    // select: {

    // },
  });
  return result ?? null;
}

export async function getUserByAddress(userAddress: string): Promise<User | null> {
  let result = await prisma.user.findFirst({
    where: {
      userAddress
    },
    // select: {

    // },
  });
  return result ?? null;
}

export async function getListings(page: number): Promise<User[] | null> {
  if (page < 1) throw Error("Invalid page!");
  let result = await prisma.user.findMany({
    take: 4,
    skip: page == 1 ? 0 : (page - 1) * 4,
    orderBy: {
      id: "asc",
    },
  });
  return result ?? null;
}
