// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
import { University } from "@prisma/client";
type ResponseType = Response<University | null>;

import { prisma } from "../../../prisma";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getUniversity(req, res);
    }
    case "DELETE": {
      return deleteUniversity(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getUniversity = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.university
    .findUnique({
      where: {
        id: Number.parseInt(req.query.id as string),
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const deleteUniversity = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.university
    .delete({ where: { id: Number.parseInt(req.query.id as string) } })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const updateUniversity = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.university
    .update({
      where: {
        id: Number.parseInt(req.query.id as string),
      },
      data: JSON.parse(req.body),
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
