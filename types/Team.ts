import { Prisma } from "@prisma/client";
export type Team = Prisma.TeamGetPayload<{
  include: {
    owner: {
      include: {
        university: true;
        degree: true;
        major: {
          include: {
            category: true;
          };
        };
      };
    };
    members: {
      include: {
        university: true;
        degree: true;
        major: {
          include: {
            category: true;
          };
        };
      };
    };
  };
}>;
