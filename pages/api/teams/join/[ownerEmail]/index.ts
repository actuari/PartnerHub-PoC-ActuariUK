// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../../types/api/Response";
import { Team } from "@prisma/client";
type ResponseType = Response<Team | null>;

import { prisma } from "../../../../../prisma";
import { authUserByToken } from "../../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "POST": {
      return joinTeam(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const joinTeam = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;
  const ownerEmail = (await req.query.ownerEmail) as string;
  if (
    await prisma.team.count({
      where: {
        ownerEmail: email,
      },
    })
  ) {
    await prisma.team.delete({
      where: {
        ownerEmail: email,
      },
    });
  }
  return prisma.team
    .update({
      where: {
        ownerEmail,
      },
      data: {
        members: {
          connect: {
            email,
          },
        },
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
