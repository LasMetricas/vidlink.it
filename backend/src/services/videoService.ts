import { S3Client, ObjectCannedACL } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
export const saveVideoS3 = async (
  file: MulterFile | undefined,
  videoLink: string
) => {
  let finalVideoLink = videoLink;
  if (file) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: `videos/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: ObjectCannedACL.public_read,
    };
    console.log("Starting S3 upload...");
    const upload = new Upload({
      client: s3Client,
      params: params,
    });
    try {
      const s3Response = await upload.done();
      console.log("S3 upload successful");
      finalVideoLink = s3Response.Location || "";
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Failed to upload video to S3");
    }
  }
};
