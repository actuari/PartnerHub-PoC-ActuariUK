// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
import { OfferDraft, User } from "@prisma/client";
type ResponseType = Response<OfferDraft | OfferDraft[]>;
import { prisma } from "../../../prisma";
import { authUserByToken } from "../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getDrafts(req, res);
    }
    case "POST": {
      return createDraft(req, res);
    }
    case "DELETE": {
      return deleteDraft(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getDrafts = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;
  return prisma.offerDraft
    .findMany({
      where: {
        employer: {
          members: {
            some: {
              email,
            },
          },
        },
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const createDraft = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;
  const employer = await prisma.employer.findUnique({
    where: { email },
  });
  return prisma.offerDraft
    .create({
      data: { ...JSON.parse(req.body), employerId: employer?.companyId },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

const deleteDraft = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;
  const employer = await prisma.employer.findUnique({
    where: { email },
  });
  const id = Number.parseInt(req.body as string);
  const draft = await prisma.offerDraft.findUnique({
    where: {
      id,
    },
  });
  if (draft?.employerId !== employer?.companyId) {
    res.status(403).json({ error: "Bad id" });
    return;
  }
  return prisma.offerDraft
    .delete({
      where: {
        id,
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
