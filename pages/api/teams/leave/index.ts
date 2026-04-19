// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../types/api/Response";
import { Team } from "@prisma/client";
type ResponseType = Response<Team | null>;

import { prisma } from "../../../../prisma";
import { authUserByToken } from "../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "POST": {
      return leaveTeam(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const leaveTeam = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      team: {
        include: {
          members: true,
        },
      },
    },
  });
  if (user?.team?.ownerEmail === email) {
    return prisma
      .$transaction([
        prisma.teamApplicationDetails.deleteMany({
          where: {
            teamOwnerEmail: email,
          },
        }),
        prisma.team.delete({
          where: {
            ownerEmail: email,
          },
        }),
      ])
      .then((data) => data[1])
      .then((data) => res.status(200).json({ data }))
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error });
      });
  }
  return prisma.team
    .update({
      where: {
        ownerEmail: user?.team?.ownerEmail,
      },
      data: {
        members: {
          disconnect: {
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
