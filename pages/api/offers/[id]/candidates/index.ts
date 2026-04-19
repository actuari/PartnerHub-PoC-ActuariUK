// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../../types/api/Response";
type ResponseType = Response<Offer | null>;

import { Offer } from "@prisma/client";
import { prisma } from "../../../../../prisma";
import { authUserByToken } from "../../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getOfferCandidates(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getOfferCandidates = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = authUserByToken(req, res);
  const offer = prisma.offer.findUnique({
    where: {
      id: Number.parseInt(req.query.id as string),
    },
  });
  const user = prisma.employer.findUnique({
    where: {
      email: await email,
    },
  });
  if ((await offer)?.employerId !== (await user)?.companyId) {
    res.status(403).json({ error: "Not allowed" });
    return;
  }
  return prisma.offer
    .findUnique({
      where: {
        id: Number.parseInt(req.query.id as string),
      },
      include: {
        employer: true,
        targetMajor: {
          include: {
            category: true,
          },
        },
        singleApplicationsDetails: {
          include: {
            user: {
              include: {
                degree: true,
                university: true,
                major: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
        teamApplicationsDetails: {
          include: {
            team: {
              include: {
                owner: {
                  include: {
                    degree: true,
                    major: {
                      include: {
                        category: true,
                      },
                    },
                    university: true,
                  },
                },
                members: {
                  include: {
                    degree: true,
                    major: {
                      include: {
                        category: true,
                      },
                    },
                    university: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const deleteOffer = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.offer
    .delete({ where: { id: Number.parseInt(req.query.id as string) } })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const updateOffer = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return prisma.offer
    .update({
      where: {
        id: Number.parseInt(req.query.id as string),
      },
      data: JSON.parse(req.body),
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
