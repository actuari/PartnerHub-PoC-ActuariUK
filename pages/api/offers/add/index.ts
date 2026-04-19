// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../types/api/Response";
type ResponseType = Response<Offer> | { data: Offer[]; maxPage: number };
import { Offer } from "@prisma/client";
import { prisma } from "../../../../prisma";
import { authUserByToken } from "../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "POST": {
      return postOffer(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const postOffer = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;
  const employerFromUser = await prisma.employer.findUnique({
    where: {
      email,
    },
  });
  const offerBody: Offer = JSON.parse(req.body);
  if (
    !offerBody?.employerId ||
    offerBody?.employerId !== employerFromUser?.companyId ||
    !employerFromUser.canAddOffers
  ) {
    res.status(403).json({ error: "Not allowed" });
    return;
  }
  return prisma.offer
    .create({ data: offerBody })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
