import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
// Configure with your Cloudinary account credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("🚀 Starting upload to Cloudinary...");
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder || "posts",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary error in upload_stream:", error);
            return reject(error);
          }
          console.log("✅ Cloudinary result:", result);
          resolve(result);
        }
      );
      stream.end(fileBuffer);
    } catch (err) {
      console.error("❌ Unexpected Cloudinary error:", err);
      reject(err);
    }
  });
};
