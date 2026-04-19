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
const avatarBucket = storage.bucket("portal_avatars");

export const createAvatarStream = (filename: string, contentType?: string) => {
  const ref = avatarBucket.file(filename);
  return createWriteStream(ref, contentType);
};
