import { Storage } from "@google-cloud/storage";
import { createWriteStream } from "./gcs";

const storage = new Storage({
  credentials: JSON.parse(process.env.GCS_KEY_JSON!),
  projectId: "portal-488421",
});
const cvBucket = storage.bucket("portal_cv");

export const createCvStream = (filename: string, contentType?: string) => {
  const ref = cvBucket.file(filename);
  return createWriteStream(ref, contentType);
};
