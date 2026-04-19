// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Response } from "../../../../types/api/Response";
type ResponseType = Response<User | null>;

import { prisma } from "../../../../prisma";
import { User } from "../../../../types/User/Detailed";
import { authUserByToken, getEmailFromToken } from "../../../../auth/server";
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  switch (req.method) {
    case "GET": {
      return getUser(req, res);
    }
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

const getUser = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (process.env.DISABLE_USERS_EMAIL_API === "true") {
    return res.status(200).json({ data: null });
  }

  const email = await authUserByToken(req, res);
  if (!email) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return prisma.user
    .findUnique({
      where: {
        email: email,
      },
      include: {
        degree: true,
        university: true,
        major: {
          include: {
            category: true,
          },
        },
        chosenOffersDetails: {
          include: {
            offer: {
              include: {
                targetMajor: {
                  include: {
                    category: true,
                  },
                },
                targetDegree: true,
                employer: true,
              },
            },

            user: {
              include: {
                university: true,
                degree: true,
                major: {
                  include: {
                    category: true,
                  },
                },
                chosenOffersDetails: {
                  include: {
                    offer: {
                      include: {
                        employer: true,
                        targetDegree: true,
                        targetMajor: {
                          include: {
                            category: true,
                          },
                        },
                      },
                    },
                  },
                },
                savedOffers: {
                  include: {
                    employer: true,
                    targetDegree: true,
                    targetMajor: {
                      include: {
                        category: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        savedOffers: {
          include: {
            employer: true,
            targetDegree: true,
            targetMajor: {
              include: {
                category: true,
              },
            },
          },
        },
        team: {
          include: {
            chosenOffersDetails: {
              include: {
                offer: {
                  include: {
                    employer: true,
                    targetDegree: true,
                    targetMajor: {
                      include: {
                        category: true,
                      },
                    },
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
