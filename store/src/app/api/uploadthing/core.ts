process.env.UPLOADTHING_TOKEN = "eyJhcGlLZXkiOiJza19saXZlX2VhYTZlYjlhZWI4NTMwNzNlZmE3YTI3MDhkMzY4M2FjOGRjZWIwYjhlZjlmZGM2ZGZlNGY2NjEzZjg4NGIzNjIiLCJhcHBJZCI6IjBpZ2pmZGNpZ3QiLCJyZWdpb25zIjpbInNlYTEiXX0=";

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
};

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "8MB" } })
        .middleware(async () => await handleAuth())
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
