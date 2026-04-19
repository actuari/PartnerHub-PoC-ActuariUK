// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../types/api/Response";
import { Employer } from "@prisma/client";
type ResponseType = Response<Employer | null>;

import { prisma } from "../../../../prisma";
import { authUserByToken, getEmailFromToken } from "../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getEmployer(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getEmployer = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const token = req.query?.token as string;
  const email = await getEmailFromToken(token);
  return prisma.employer
    .findUnique({
      where: {
        email,
      },
      include: {
        company: true,
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
