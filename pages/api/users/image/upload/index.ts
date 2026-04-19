import formidable from "formidable"; //"../../../../../lib/formidable-serverless";
import { NextApiRequest, NextApiResponse } from "next";
import * as gcs from "../../../../../lib/gcs_avatar";
import { PassThrough } from "stream";
import { authUserByToken } from "../../../../../auth/server";

const uploadStream = (email: string) => (file: formidable.File) => {
  const pass = new PassThrough();
  const fileName = email;

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
  const form = await formidable({
    // @ts-ignore
    fileWriteStreamHandler: uploadStream(email),
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
