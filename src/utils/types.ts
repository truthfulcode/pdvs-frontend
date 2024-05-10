import { UserType } from "@prisma/client";

export type User = {
  userType: UserType;
  userAddress: string;
  matricNumber: string;
  cgpa: number;
  fullName: string;
};
