import { Storage } from "@google-cloud/storage";
import { createWriteStream } from "./gcs";
const path = require("path");
const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    "../../../../../../config/gcs-key.json"
  ),
  projectId: "portal-488421",
});
const cvBucket = storage.bucket("portal_cv");

export const createCvStream = (filename: string, contentType?: string) => {
  const ref = cvBucket.file(filename);
  return createWriteStream(ref, contentType);
};
