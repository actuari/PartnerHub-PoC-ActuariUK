// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
import { Major } from "@prisma/client";
type ResponseType = Response<Major | Major[]>;
import { prisma } from "../../../prisma";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getMajors(req, res);
    }
    case "POST": {
      return postMajor(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getMajors = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.major
    .findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const postMajor = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.major
    .create({ data: JSON.parse(req.body) })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
