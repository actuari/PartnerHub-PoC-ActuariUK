// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
import { Degree } from "@prisma/client";
type ResponseType = Response<Degree | null>;

import { prisma } from "../../../prisma";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getDegree(req, res);
    }
    case "DELETE": {
      return deleteDegree(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getDegree = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.degree
    .findUnique({
      where: {
        id: Number.parseInt(req.query.id as string),
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const deleteDegree = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.degree
    .delete({ where: { id: Number.parseInt(req.query.id as string) } })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
