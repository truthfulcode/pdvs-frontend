import { prisma } from "../../../src/utils/prisma";

export async function getUserById(id: string) {
  const result = await prisma.user.findFirst({
    where: {
      id,
    },
  });
  return result ?? null;
}

export async function isUserAdminOrCM(addr: string) {
  const res = await prisma.user.findFirst({
    where: {
      userType: {
        in: ["ADMIN", "CM"]
      },
      userAddress: addr,
    },
  });

  return !!res;
}

export async function isUserAdmin(addr: string) {
  const res = await prisma.user.findFirst({
    where: {
      userType: "ADMIN",
      userAddress: addr,
    },
  });

  return !!res;
}

export async function getUserByAddress(userAddress: string) {
  const result = await prisma.user.findFirst({
    where: {
      userAddress,
    },
  });
  return result ?? null;
}

export async function getUsers() {
  const result = await prisma.user.findMany({
    orderBy: {
      id: "asc",
    },
    where: {
      userType :{
        not:{
          equals: "ADMIN"
        }
      }
    }
  });
  return result ?? null;
}
