import { Proposal } from "@/utils/types";
import { prisma } from "../../../src/utils/prisma";

export async function updateComment(
  userId: string,
  commentId: string,
  content: string
) {
  const c = await prisma.comment.findFirst({
    where: {
      id: commentId,
    },
  });

  if (!c) throw Error("Comment doesn't exist!");
  if (c.authorId !== userId) throw Error("Caller not the author!");
  let createdAt = new Date(c.createdAt);
  let expirationAtTime = createdAt.getTime() + 10 * 60 * 1000;
  let now = new Date().getTime();
  if (now > expirationAtTime) throw Error("Editing period expired!");
  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content,
    },
  });
}
