import { prisma } from "../src/utils/prisma";
import { AdminVotingToken } from "../src/AdminVotingToken";
import { Address } from "viem";

async function main() {
  const filler =
    "Lorem ipsum dolor sit amet, sea mazim insolens ei, vis sint volumus ullamcorper ex. Quo ne alienum eligendi similique. Amet alii pri et. Prima quaestio eleifend at pri, blandit perfecto menandri cu est. Cu cum nihil consetetur, consul mucius et eum, tibique adipisci ad pro. Erant doctus efficiendi et quo.";

  const proposals = await prisma.proposal.createMany({
    data: [
      {
        title: "P1: Increase Funding for School of Computing Hackathons",
        content: "This proposal seeks to allocate additional funding from the PERSAKA budget to support the organization and execution of School of Computing hackathons. The aim is to encourage more student participation, foster innovation, and provide opportunities for students to develop their skills in a practical, collaborative environment.",
        createdAt: new Date(),
        likesCount: 0,
        status: "Draft",
      },
      {
        title: "P2: Establish a School of Computing Mentorship Program",
        content: "This proposal proposes the establishment of a formalized mentorship program within the School of Computing. This program would pair senior students with their junior counterparts, providing guidance on academic pursuits, career exploration, and navigating university life. The goal is to foster a strong sense of community and support for students across all academic levels.",
        createdAt: new Date(),
        likesCount: 0,
        status: "Draft",
      },
      {
        title: "P3: Improve School of Computing Career Resources and Networking Opportunities",
        content: "This proposal aims to enhance the School of Computing's career resources and networking opportunities for students. This includes expanding partnerships with industry professionals, organizing career fairs and workshops, and providing more robust online resources for career exploration and job searching. The goal is to better prepare students for successful careers in the field of computer science.",
        createdAt: new Date(),
        likesCount: 0,
        status: "Draft",
      },
      {
        title: "P4: Expand the Use of Online Learning Platforms and Resources in School of Computing Courses",
        content: "This proposal advocates for the expanded use of online learning platforms and resources within School of Computing courses. This would involve leveraging existing platforms or exploring new ones to provide supplementary learning materials, interactive exercises, and online discussion forums. The goal is to enhance the learning experience, cater to diverse learning styles, and increase flexibility for students.",
        createdAt: new Date(),
        likesCount: 0,
        status: "Draft",
      },
    ],
  });

  const p1 = await prisma.proposal.findFirst({
    where: {
      title: {
        contains: "P1",
      },
    },
  });

  const p2 = await prisma.proposal.findFirst({
    where: {
      title: {
        contains: "P2",
      },
    },
  });

  const p3 = await prisma.proposal.findFirst({
    where: {
      title: {
        contains: "P3",
      },
    },
  });

  const p4 = await prisma.proposal.findFirst({
    where: {
      title: {
        contains: "P4",
      },
    },
  });

  const ADDRESSES = {
    admin: "0x17fBA9Eb71F040d57d19B48A28002FfE32380DF8",
    u1: "0x20fb3a8Ba650265aaA9565a089F3a5B921cDcF2F",
    u2: "0xe63F6c20fa701B4c09CC8419Cb918de950650Bf7",
    u3: "0xF3fB9d54F8a556aa7c939e36CbA6C0019c8d3DCe",
    u4: "0x2281b9e03f112B8538349eDA2d777Dc16D17Ff93",
  };

  const vt = new AdminVotingToken();

  async function mint(
    userAddress: string,
    cgpa: number,
    userType: "STUDENT" | "CM"
  ) {
    try {
      const simulation = await vt.simulate("adjust", [
        userAddress as Address,
        cgpa,
        userType === "CM" ? 2 : 1,
      ]);
      await vt.execute(simulation.request);
    } catch(err) {
      console.log(userAddress," likely has been minted")
    }
  }

  

  const users = await prisma.user.createMany({
    data: [
      {
        cgpa: 0,
        fullName: "Admin",
        matricNumber: "",
        userAddress: ADDRESSES.admin,
        userType: "ADMIN",
      },
      {
        cgpa: 200,
        fullName: "Ahmed khaled",
        matricNumber: "A20EE3021",
        userAddress: ADDRESSES.u1,
        userType: "STUDENT",
      },
      {
        cgpa: 300,
        fullName: "Ali Said",
        matricNumber: "A18CV2011",
        userAddress: ADDRESSES.u2,
        userType: "CM",
      },
      {
        cgpa: 350,
        fullName: "Mohamed Said",
        matricNumber: "A19EV3302",
        userAddress: ADDRESSES.u3,
        userType: "STUDENT",
      },
      {
        cgpa: 400,
        fullName: "Kheir edin",
        matricNumber: "A22MC0200",
        userAddress: ADDRESSES.u4,
        userType: "CM",
      },
    ],
  });

  await mint(ADDRESSES.u1, 200, "STUDENT");
  await mint(ADDRESSES.u2, 300, "CM");
  await mint(ADDRESSES.u3, 350, "STUDENT");
  await mint(ADDRESSES.u4, 400, "CM");

  const u1 = await prisma.user.findFirst({
    where: {
      userAddress: ADDRESSES.u1,
    },
  });

  const u2 = await prisma.user.findFirst({
    where: {
      userAddress: ADDRESSES.u2,
    },
  });

  const u3 = await prisma.user.findFirst({
    where: {
      userAddress: ADDRESSES.u3,
    },
  });

  const u4 = await prisma.user.findFirst({
    where: {
      userAddress: ADDRESSES.u4,
    },
  });

  await createComment(u1!.id, p1?.id as string, "that's very interesting ser");
  await createComment(
    u2!.id,
    p2?.id as string,
    "wow, would love to hear more about it"
  );
  await createComment(
    u3!.id,
    p3?.id as string,
    "how would it affect the voting power?"
  );
  await createComment(
    u4!.id,
    p4?.id as string,
    "i would like to recommend adding Abdullah kheir."
  );

  console.log({ proposals, users });
}

async function createComment(
  userId: string,
  proposalId: string,
  message: string
) {
  const comments = await prisma.comment.create({
    data: {
      authorId: userId,
      proposalId: proposalId,
      content: message,
      createdAt: new Date(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
