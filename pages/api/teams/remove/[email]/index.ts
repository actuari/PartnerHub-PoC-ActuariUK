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
      return removeFromTeam(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const removeFromTeam = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const toRemove = req.query.email as string;
  const requestEmail = await authUserByToken(req, res);
  if (!requestEmail) return;
  return prisma.team
    .update({
      where: {
        ownerEmail: requestEmail,
      },
      data: {
        members: {
          disconnect: {
            email: toRemove,
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
