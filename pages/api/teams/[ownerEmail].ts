// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
type ResponseType = Response<Team[] | Team | null>;
import { prisma } from "../../../prisma";
import { Team } from "../../../types/Team";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getTeam(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getTeam = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const ownerEmail = req.query.ownerEmail as string;
  return prisma.team
    .findUnique({
      where: {
        ownerEmail,
      },
      include: {
        owner: {
          include: {
            university: true,
            degree: true,
            major: {
              include: {
                category: true,
              },
            },
          },
        },
        members: {
          include: {
            university: true,
            degree: true,
            major: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
