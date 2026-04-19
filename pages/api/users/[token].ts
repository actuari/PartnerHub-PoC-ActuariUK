// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
import { User } from "@prisma/client";
type ResponseType = Response<User | User[]>;
import { prisma } from "../../../prisma";
import { getEmailFromToken } from "../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "POST": {
      return createUser(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const createUser = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const token = req.query?.token as string;
  const email = await getEmailFromToken(token);
  return prisma.user
    .create({ data: { ...JSON.parse(req.body), email } })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
