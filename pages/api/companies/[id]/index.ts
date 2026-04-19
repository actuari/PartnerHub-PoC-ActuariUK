// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../types/api/Response";
type ResponseType = Response<Company | null>;

import { Company } from "@prisma/client";
import { prisma } from "../../../../prisma";
import { authUserByToken } from "../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getCompany(req, res);
    }
    case "PUT": {
      return updateCompany(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getCompany = async (
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
    .findUnique({
      where: {
        id,
      },
      include: {
        offers: {
          include: {
            singleApplicationsDetails: {
              include: {
                user: {
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
            targetDegree: true,
            targetMajor: {
              include: {
                category: true,
              },
            },
          },
        },
        members: {
          orderBy: {
            id: "asc",
          },
        },
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};

const updateCompany = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const email = await authUserByToken(req, res);
  if (!email) return;
  const employerFromEmail = await prisma.employer.findUnique({
    where: {
      email,
    },
    include: {
      company: true,
    },
  });
  const id = Number.parseInt(req.query.id as string);
  if (
    id !== employerFromEmail?.companyId ||
    !employerFromEmail?.canUpdateCompanyDetails
  ) {
    res.status(403).json({ error: "Not allowed" });
    return;
  }
  return prisma.company
    .update({
      where: {
        id: Number.parseInt(req.query.id as string),
      },
      data: {
        ...JSON.parse(req.body),
        name: employerFromEmail?.company?.name,
      },
    })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
};
