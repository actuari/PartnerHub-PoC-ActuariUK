// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../types/api/Response";
type ResponseType = Response<User | null>;

import { prisma } from "../../../../prisma";
import { User } from "../../../../types/User/Basic";
import { getEmailFromToken } from "../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getUser(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getUser = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const token = req.query?.token as string;
  const email = await getEmailFromToken(token);
  return prisma.user
    .findUnique({
      where: {
        email: email as string,
      },
      include: {
        degree: true,
        university: true,
        major: {
          include: {
            category: true,
          },
        },
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
