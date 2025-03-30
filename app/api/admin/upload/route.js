// app/api/admin/upload/route.js
import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3-upload';
import { requireAdmin } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    // Check if user is admin
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'content';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const result = await uploadToS3(file, folder);

    return NextResponse.json({
      success: true,
      fileUrl: result.url,
      fileKey: result.key,
      contentType: result.contentType,
    });
  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}