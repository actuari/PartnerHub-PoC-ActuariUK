import { File } from "@google-cloud/storage";

export const createWriteStream = (ref: File, contentType?: string) => {
  const stream = ref.createWriteStream({
    gzip: true,
    contentType: contentType,
  });

  return stream;
};
