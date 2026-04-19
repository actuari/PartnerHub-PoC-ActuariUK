import { Prisma } from "@prisma/client";
export type Employer = Prisma.EmployerGetPayload<{
  include: {
    company: {
      include: {
        members: true;
        offers: true;
      };
    };
  };
}>;
