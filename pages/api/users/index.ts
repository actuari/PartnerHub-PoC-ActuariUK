// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
import { User } from "@prisma/client";
type ResponseType = Response<User | User[]>;
import { prisma } from "../../../prisma";
import { authUserByToken } from "../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getUsers(req, res);
    }
    case "PUT": {
      return updateUser(req, res);
    }
    case "POST": {
      return createUser(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getUsers = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.user
    .findMany()
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;
  return prisma.user
    .update({
      where: {
        email,
      },
      data: {
        ...JSON.parse(req.body),
        email,
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

const createUser = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;
  return prisma.user
    .create({ data: { ...JSON.parse(req.body), email } })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
