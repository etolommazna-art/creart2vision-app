import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'; import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const s3=new S3Client({ region: process.env.S3_REGION||'eu-west-3', credentials:{ accessKeyId: process.env.S3_ACCESS_KEY_ID||'', secretAccessKey: process.env.S3_SECRET_ACCESS_KEY||'' } });
export async function signKey(key:string){ const cmd=new GetObjectCommand({ Bucket: process.env.S3_BUCKET||'', Key: key }); return await getSignedUrl(s3, cmd, { expiresIn: 3600 }); }
