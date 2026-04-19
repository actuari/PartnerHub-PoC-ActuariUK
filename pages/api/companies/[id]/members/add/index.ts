// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../../../types/api/Response";
type ResponseType = Response<Company | null>;

import { Company } from "@prisma/client";
import { prisma } from "../../../../../../prisma";
import { authUserByToken } from "../../../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "POST": {
      return addMember(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const addMember = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;
  const employerFromEmail = await prisma.employer.findUnique({
    where: {
      email,
    },
  });
  const id = Number.parseInt(req.query.id as string);
  if (id !== employerFromEmail?.companyId) {
    res.status(403).json({ error: "Not allowed" });
    return;
  }
  return prisma.company
    .update({
      where: {
        id,
      },
      data: {
        members: {
          create: JSON.parse(req.body),
        },
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
