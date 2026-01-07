import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@/lib/env';

/**
 * Initialize S3 client with configuration from environment variables
 */
const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
  endpoint: env.AWS_S3_ENDPOINT,
  forcePathStyle: !!env.AWS_S3_ENDPOINT, // Use path-style for S3-compatible services
});

/**
 * Upload file to S3
 * @param fileBuffer File buffer to upload
 * @param fileName File name (will be prefixed with timestamp)
 * @param contentType MIME type of the file
 * @param folder Optional folder prefix (e.g., 'uploads', 'project/images')
 * @returns Public URL of the uploaded file
 */
export async function uploadToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder?: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = folder
      ? `${folder}/${timestamp}-${sanitizedFileName}`
      : `${timestamp}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Return public URL
    // If using custom endpoint (like MinIO), use that endpoint
    // Otherwise, use standard S3 URL format
    if (env.AWS_S3_ENDPOINT) {
      const endpointUrl = new URL(env.AWS_S3_ENDPOINT);
      return `${endpointUrl.protocol}//${endpointUrl.host}/${env.AWS_S3_BUCKET_NAME}/${key}`;
    } else {
      return `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
    }
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
}

/**
 * Delete file from S3
 * @param fileUrl Full URL or key of the file to delete
 */
export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    // Extract key from URL
    let key = fileUrl;
    
    // Handle full URLs (http:// or https://)
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      try {
        const url = new URL(fileUrl);
        const pathParts = url.pathname.split('/').filter(part => part);
        
        // For custom endpoints: http://endpoint/bucket/key
        if (env.AWS_S3_ENDPOINT && pathParts.length > 1) {
          // First part is bucket, rest is key
          key = pathParts.slice(1).join('/');
        }
        // For standard S3 URLs: https://bucket.s3.region.amazonaws.com/key
        else if (pathParts.length > 0) {
          key = pathParts.join('/');
        }
      } catch {
        // If URL parsing fails, try to extract from path
        const urlParts = fileUrl.split('/');
        const bucketIndex = urlParts.findIndex(part => part === env.AWS_S3_BUCKET_NAME);
        if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
          key = urlParts.slice(bucketIndex + 1).join('/');
        }
      }
    }
    // Handle relative paths like /uploads/filename
    else if (fileUrl.startsWith('/')) {
      key = fileUrl.slice(1);
    }

    const command = new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
}

/**
 * Get presigned URL for file access (useful for private files)
 * @param key S3 object key
 * @param expiresIn Expiration time in seconds (default: 3600)
 * @returns Presigned URL
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('S3 presigned URL error:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

