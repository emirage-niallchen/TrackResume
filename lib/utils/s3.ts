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
 * 
 * 上传文件到S3存储桶，自动添加时间戳前缀避免文件名冲突
 * 
 * @param fileBuffer - 文件缓冲区
 * @param fileName - 原始文件名（会自动清理特殊字符）
 * @param contentType - MIME类型（如 'image/jpeg', 'application/pdf'）
 * @param folder - 可选的文件夹前缀（如 'uploads', 'admin/avatar', 'tech/icons'）
 * @returns 上传后的公开访问URL
 * 
 * @throws {Error} 上传失败时抛出错误
 * 
 * @example
 * ```ts
 * const buffer = Buffer.from(fileData);
 * const url = await uploadToS3(buffer, 'avatar.jpg', 'image/jpeg', 'admin/avatar');
 * // 返回: 'https://bucket.s3.region.amazonaws.com/admin/avatar/1234567890-avatar.jpg'
 * ```
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
 * Extract S3 key from URL
 * 
 * 从S3 URL中提取对象键（key）
 * 支持多种URL格式：
 * - 标准S3 URL: https://bucket.s3.region.amazonaws.com/key
 * - 自定义端点URL: http://endpoint/bucket/key
 * - 相对路径: /uploads/file.jpg
 * - 直接key: uploads/file.jpg
 * 
 * @param fileUrl - S3文件URL或key
 * @returns S3对象键
 * 
 * @example
 * ```ts
 * extractKeyFromUrl('https://bucket.s3.region.amazonaws.com/uploads/file.jpg')
 * // 返回: 'uploads/file.jpg'
 * ```
 */
export function extractKeyFromUrl(fileUrl: string): string {
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

  return key;
}

/**
 * Delete file from S3
 * 
 * 从S3存储桶中删除文件
 * 支持通过完整URL或对象键删除
 * 
 * @param fileUrl - S3文件URL或对象键
 * @returns Promise<void>
 * 
 * @throws {Error} 删除失败时抛出错误
 * 
 * @example
 * ```ts
 * // 通过URL删除
 * await deleteFromS3('https://bucket.s3.region.amazonaws.com/uploads/file.jpg');
 * 
 * // 通过key删除
 * await deleteFromS3('uploads/file.jpg');
 * ```
 */
export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    const key = extractKeyFromUrl(fileUrl);

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
 * Get presigned URL for file access
 * 
 * 生成预签名URL，用于访问私有文件或临时访问
 * 预签名URL有过期时间，过期后无法访问
 * 
 * @param key - S3对象键（支持从URL中自动提取）
 * @param expiresIn - 过期时间（秒），默认3600秒（1小时）
 * @returns 预签名URL
 * 
 * @throws {Error} 生成失败时抛出错误
 * 
 * @example
 * ```ts
 * // 生成1小时有效的预签名URL
 * const url = await getPresignedUrl('uploads/private-file.pdf');
 * 
 * // 生成24小时有效的预签名URL
 * const url = await getPresignedUrl('uploads/private-file.pdf', 86400);
 * ```
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    // Extract key if URL is provided
    const objectKey = key.startsWith('http://') || key.startsWith('https://')
      ? extractKeyFromUrl(key)
      : key;

    const command = new GetObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: objectKey,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('S3 presigned URL error:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

/**
 * Check if URL is an S3 URL
 * 
 * 检查URL是否为S3存储的URL
 * 用于判断是否需要使用S3相关操作
 * 
 * @param url - 要检查的URL
 * @returns 是否为S3 URL
 * 
 * @example
 * ```ts
 * isS3Url('https://bucket.s3.region.amazonaws.com/file.jpg') // true
 * isS3Url('data:image/jpeg;base64,...') // false
 * isS3Url('/uploads/file.jpg') // false
 * ```
 */
export function isS3Url(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Check if URL is base64 data URL
 * 
 * 检查URL是否为base64编码的数据URL
 * 用于向后兼容处理旧的base64存储方式
 * 
 * @param url - 要检查的URL
 * @returns 是否为base64数据URL
 * 
 * @example
 * ```ts
 * isBase64Url('data:image/jpeg;base64,/9j/4AAQ...') // true
 * isBase64Url('https://bucket.s3.region.amazonaws.com/file.jpg') // false
 * ```
 */
export function isBase64Url(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('data:');
}

