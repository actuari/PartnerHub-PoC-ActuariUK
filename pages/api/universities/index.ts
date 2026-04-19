// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
import { University } from "@prisma/client";
type ResponseType = Response<University | University[]>;
import { prisma } from "../../../prisma";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getUniversities(req, res);
    }
    case "POST": {
      return postUniversity(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getUniversities = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.university
    .findMany({
      orderBy: {
        name: "asc",
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const postUniversity = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.university
    .create({ data: JSON.parse(req.body) })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
