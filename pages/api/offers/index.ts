// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../types/api/Response";
type ResponseType =
  | Response<Offer>
  | { data: Offer[]; maxPage: number; count: number };
import { Offer } from "@prisma/client";
import { prisma } from "../../../prisma";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getOffers(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const DEFAULT = {
  PAGE: "1",
  PER_PAGE: "9",
};
const getOffers = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const perPage = Number.parseInt(
    (req.query.perPage as string) || DEFAULT.PER_PAGE
  );
  const page = Number.parseInt((req.query.page as string) || DEFAULT.PAGE);
  const companyNames = ((req.query.companies as string) || "").split(",");
  const paginationRequirement = {
    skip: perPage * (page - 1),
    take: perPage,
  };

  const companyRequirement =
    companyNames.length === 1 && companyNames.at(0) === ""
      ? {
          ...paginationRequirement,
          where: {},
        }
      : {
          ...paginationRequirement,
          where: {
            employer: {
              name: {
                in: companyNames,
              },
            },
          },
        };

  const majors = ((req.query.majors as string) || "").split(",");
  const majorCategories = ((req.query.majorCategories as string) || "").split(
    ","
  );
  const majorRequirement =
    majors.length === 1 && majors.at(0) === ""
      ? {
          ...companyRequirement,
          where: {
            ...companyRequirement.where,
            targetMajor: {},
          },
        }
      : {
          ...companyRequirement,
          where: {
            ...companyRequirement.where,
            targetMajor: {
              name: {
                in: majors,
              },
            },
          },
        };
  const majorCategoryRequirement =
    majorCategories.length === 1 && majorCategories.at(0) === ""
      ? majorRequirement
      : {
          ...majorRequirement,
          where: {
            ...majorRequirement.where,
            targetMajor: {
              OR: [
                majorRequirement.where.targetMajor,
                {
                  category: {
                    name: {
                      in: majorCategories,
                    },
                  },
                },
              ],
            },
          },
        };
  const savedBy = req.query.savedBy;

  const savedByRequirements = savedBy
    ? {
        ...majorCategoryRequirement,
        where: {
          ...majorCategoryRequirement.where,
          usersThatSaved: {
            some: {
              id: {
                equals: Number.parseInt(savedBy as string),
              },
            },
          },
        },
      }
    : majorCategoryRequirement;
  const degreeName = req.query.degree;
  const degreeRequirements =
    degreeName && degreeName !== "all"
      ? {
          ...savedByRequirements,
          where: {
            ...savedByRequirements.where,
            targetDegree: {
              name: {
                equals: degreeName,
              },
            },
          },
        }
      : savedByRequirements;
  const requirements: any = degreeRequirements;
  const offersCount = await prisma.offer.count({
    ...requirements,
    skip: 0,
    take: undefined,
  });

  return prisma.offer
    .findMany({
      ...requirements,
      include: {
        employer: true,
        targetMajor: {
          include: {
            category: true,
          },
        },
        targetDegree: true,
      },
      orderBy: {
        id: "desc",
      },
    })
    .then((data) =>
      res
        .status(200)
        .json({
          data,
          maxPage: Math.ceil(offersCount / perPage),
          count: offersCount,
        })
    )
    .catch((error) => res.status(500).json({ error }));
};
