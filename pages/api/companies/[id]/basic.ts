// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../types/api/Response";
type ResponseType = Response<Company | null>;

import { Company } from "@prisma/client";
import { prisma } from "../../../../prisma";
import { authUserByToken } from "../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getCompany(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getCompany = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const id = Number.parseInt(req.query.id as string);
  return prisma.company
    .findUnique({
      where: {
        id,
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
