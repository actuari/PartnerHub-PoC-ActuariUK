// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../types/api/Response";
import { Employer } from "@prisma/client";
type ResponseType = Response<Employer>;
import { prisma } from "../../../../prisma";
import { authUserByToken } from "../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "PUT": {
      return updateEmployer(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const updateEmployer = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;

  const requester = await prisma.employer.findUnique({
    where: {
      email: email,
    },
  })!;

  const toChange = await prisma.employer.findUnique({
    where: {
      id: Number.parseInt(req.query.id as string),
    },
  })!;

  if (
    toChange?.companyId !== requester?.companyId ||
    !requester?.canManagePermissions
  ) {
    if (requester?.email === toChange?.email) {
      const data = JSON.parse(req.body);
      return prisma.employer
        .update({
          where: {
            id: Number.parseInt(req.query.id as string),
          },
          data: {
            name: data.name,
            surname: data.surname,
          },
        })
        .then((data) => res.status(200).json({ data }))
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error });
        });
    } else {
      res.status(403).json({ error: "Not allowed" });
      return;
    }
  }
  return prisma.employer
    .update({
      where: {
        id: Number.parseInt(req.query.id as string),
      },
      data: JSON.parse(req.body),
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
