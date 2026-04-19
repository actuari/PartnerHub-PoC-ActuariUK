// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../../../types/api/Response";
type ResponseType = Response<Offer | SingleApplicationDetails | null>;

import { SingleApplicationDetails, Offer } from "@prisma/client";
import { prisma } from "../../../../../../prisma";
import { authUserByToken } from "../../../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "PUT": {
      return returnOffer(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const returnOffer = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const offerId = Number.parseInt(req.query.id as string);
  const actionCreatorEmail = await authUserByToken(req, res);
  if (!actionCreatorEmail) return;
  const email = req.body as string;
  const employerFromEmail = await prisma.employer.findUnique({
    where: {
      email: actionCreatorEmail,
    },
  });
  const offer = await prisma.offer.findUnique({
    where: {
      id: offerId,
    },
  });
  if (
    !employerFromEmail?.canManageCandidates ||
    employerFromEmail.companyId !== offer?.employerId
  ) {
    res.status(403).json({ error: "Not allowed" });
    return;
  }
  return prisma.singleApplicationDetails
    .update({
      where: {
        userEmail_offerId: {
          userEmail: email,
          offerId,
        },
      },
      data: {
        isAccepted: false,
        isRejected: false,
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
