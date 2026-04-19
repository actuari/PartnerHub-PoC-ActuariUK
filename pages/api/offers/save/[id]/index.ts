// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../../types/api/Response";
type ResponseType = Response<Offer | null>;

import { Offer, User } from "@prisma/client";
import { prisma } from "../../../../../prisma";
import { authUserByToken } from "../../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "PUT": {
      return saveOffer(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const saveOffer = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const offer: (Offer & { usersThatSaved: User[] }) | null =
    await prisma.offer.findUnique({
      where: {
        id: Number.parseInt(req.query.id as string),
      },
      include: {
        usersThatSaved: true,
      },
    });
  const newEmail = await authUserByToken(req, res);
  if (!newEmail) return;
  const usersThatSaved = offer?.usersThatSaved?.map((user) => user.email) || [];
  if (!usersThatSaved.some((email) => email === newEmail)) {
    usersThatSaved.push(newEmail);
  }
  return prisma.offer
    .update({
      where: {
        id: Number.parseInt(req.query.id as string),
      },
      data: {
        usersThatSaved: {
          set: usersThatSaved.map((email) => ({ email })),
        },
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
