import { Prisma } from "@prisma/client";
export type Major = Prisma.MajorGetPayload<{
  include: {
    category: true;
  };
}>;
