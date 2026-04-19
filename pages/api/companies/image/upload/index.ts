import formidable from "formidable"; //"../../../../../lib/formidable-serverless";
import { NextApiRequest, NextApiResponse } from "next";
import * as gcs from "../../../../../lib/gcs_avatar";
import { PassThrough } from "stream";
import { authUserByToken } from "../../../../../auth/server";
import { prisma } from "../../../../../prisma";

const uploadStream = (companyName: string) => (file: formidable.File) => {
  const pass = new PassThrough();
  const fileName = companyName;

  const stream = gcs.createAvatarStream(
    //file.originalFilename ?? file.newFilename,
    fileName,
    file.mimetype ?? undefined
  );
  pass.pipe(stream);
  return pass;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const email = await authUserByToken(req, res);
  if (!email) return;
  const employer = await prisma.employer.findUnique({
    where: {
      email,
    },
    include: {
      company: true,
    },
  });
  if (!employer) {
    res.status(403).json({ data: "Not allowed" });
  }
  const form = await formidable({
    // @ts-ignore
    fileWriteStreamHandler: uploadStream(employer?.company.name || ""),
  });

  const formPromise = await new Promise((resolve, reject) => {
    form.parse(req, async (err, _, files) => {
      if (err) reject(err);
      const file = files.uploadedFile;
      resolve(file);
    });
  });
  res.json(formPromise);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
