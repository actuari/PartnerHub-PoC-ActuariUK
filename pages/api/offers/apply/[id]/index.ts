// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../../types/api/Response";
type ResponseType = Response<Offer | SingleApplicationDetails | null>;

import { SingleApplicationDetails, Offer } from "@prisma/client";
import { prisma } from "../../../../../prisma";
import { authUserByToken } from "../../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "PUT": {
      return applyToOffer(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const applyToOffer = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const newEmail = await authUserByToken(req, res);
  if (!newEmail) return;
  const offerId = Number.parseInt(req.query.id as string);
  return prisma.singleApplicationDetails
    .create({
      data: {
        offerId,
        userEmail: newEmail,
        isAccepted: false,
        isRejected: false,
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
