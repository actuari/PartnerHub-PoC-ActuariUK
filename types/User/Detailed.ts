import { Prisma } from "@prisma/client";
export type User = Prisma.UserGetPayload<{
  include: {
    university: true;
    degree: true;
    major: {
      include: {
        category: true;
      };
    };
    team: {
      include: {
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
}>;
