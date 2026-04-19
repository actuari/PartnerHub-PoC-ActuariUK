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
    teamApplicationsDetails: {
      include: {
        team: {
          include: {
            owner: {
              include: {
                degree: true;
                major: {
                  include: {
                    category: true;
                  };
                };
                university: true;
              };
            };
            members: {
              include: {
                degree: true;
                major: {
                  include: {
                    category: true;
                  };
                };
                university: true;
              };
            };
          };
        };
      };
    };
    singleApplicationsDetails: {
      include: {
        user: {
          include: {
            degree: true;
            university: true;
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
  };
}>;
