import { Storage } from "@google-cloud/storage";
import { createWriteStream } from "./gcs";

const storage = new Storage({
  credentials: JSON.parse(process.env.GCS_KEY_JSON!),
  projectId: "portal-488421",
});
const avatarBucket = storage.bucket("portal_avatars");

export const createAvatarStream = (filename: string, contentType?: string) => {
  const ref = avatarBucket.file(filename);
  return createWriteStream(ref, contentType);
};
