import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

const sessionDataToEmail = (session: any): string | undefined =>
  session?.user?.email || undefined;

export const authUserByToken = (
  req: NextApiRequest,
  res: NextApiResponse<any>
): Promise<string | undefined> => {
  return getServerSession(req, res, authOptions).then(sessionDataToEmail);
};

export const getEmailFromToken = async (
  token?: string
): Promise<string | undefined> => {
  return token || undefined;
};
