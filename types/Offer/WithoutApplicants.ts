import { Prisma } from "@prisma/client";
export type Offer = Prisma.OfferGetPayload<{
  include: {
    employer: true;
    targetMajor: {
      include: {
        category: true;
      };
    };
    targetDegree: true;
  };
}>;
