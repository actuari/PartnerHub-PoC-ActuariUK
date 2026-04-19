import { Prisma } from "@prisma/client";
export type SingleApplicationDetails =
  Prisma.SingleApplicationDetailsGetPayload<{
    include: {
      offer: {
        include: {
          targetDegree: true;
          targetMajor: {
            include: {
              category: true;
            };
          };
          employer: true;
        };
      };
      user: {
        include: {
          university: true;
          degree: true;
          major: {
            include: {
              category: true;
            };
          };
          chosenOffersDetails: {
            include: {
              offer: {
                include: {
                  employer: true;
                  targetDegree: true;
                  targetMajor: {
                    include: {
                      category: true;
                    };
                  };
                };
              };
            };
          };
          savedOffers: {
            include: {
              employer: true;
              targetDegree: true;
              targetMajor: {
                include: {
                  category: true;
                };
              };
            };
          };
        };
      };
    };
  }>;
