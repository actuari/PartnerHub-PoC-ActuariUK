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
  };
}>;
