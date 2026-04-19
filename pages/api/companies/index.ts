// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
type ResponseType = Response<Company | Company[]>;
import { Company } from "@prisma/client";
import { prisma } from "../../../prisma";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getCompanies(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getCompanies = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.company
    .findMany({
      orderBy: {
        name: "asc",
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
