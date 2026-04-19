// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
import { Degree } from "@prisma/client";
type ResponseType = Response<Degree | Degree[]>;
import { prisma } from "../../../prisma";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getDegrees(req, res);
    }
    case "POST": {
      return postDegree(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getDegrees = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.degree
    .findMany({
      orderBy: {
        name: "asc",
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const postDegree = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.degree
    .create({ data: JSON.parse(req.body) })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
