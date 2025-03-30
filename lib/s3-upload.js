import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadToS3 = async (file, folder = 'content') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Get file extension
    const fileExtension = file.originalFilename.split('.').pop().toLowerCase();
    
    // Determine content type based on extension
    let contentType = 'application/octet-stream';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      contentType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
    } else if (['mp4', 'webm', 'mov'].includes(fileExtension)) {
      contentType = `video/${fileExtension}`;
    }

    // Generate unique filename
    const key = `${folder}/${uuidv4()}.${fileExtension}`;
    
    // Get file buffer for upload
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    };

    // Upload to S3
    const result = await s3.upload(params).promise();
    
    return {
      url: result.Location,
      key: result.Key,
      contentType: contentType.split('/')[0], // 'image' or 'video'
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

export const deleteFromS3 = async (key) => {
  try {
    if (!key) {
      throw new Error('No file key provided');
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error(`File deletion failed: ${error.message}`);
  }
};

// Generate a signed URL for temporary access to private objects
export const getSignedUrl = async (key, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: expiresIn,
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error) {
    console.error('Signed URL generation error:', error);
    throw new Error(`Could not generate signed URL: ${error.message}`);
  }
};