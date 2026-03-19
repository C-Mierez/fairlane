import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // The name 'uploader' is the default used by the Payload plugin
  uploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    video: { maxFileSize: "16MB", maxFileCount: 1 },
    blob: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => ({ userId: "payload-user" }))
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
