// app/api/content/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Content from '@/models/Content';
import Model from '@/models/Model';
import { getCurrentUser } from '@/lib/auth';
import { deleteFromS3 } from '@/lib/s3-upload';

// Get a specific content item
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    
    await connectToDatabase();
    
    const content = await Content.findById(id).populate('modelId', 'name');
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    // Check premium access
    if (content.isPremium && (!user || user.membershipStatus !== 'premium')) {
      return NextResponse.json(
        { error: 'Premium membership required to view this content' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// Update content (admin only)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const updates = await request.json();
    
    await connectToDatabase();
    
    // Get the original content to check for premium status change
    const originalContent = await Content.findById(id);
    if (!originalContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    // Update the content
    const content = await Content.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    // Check if premium status changed and update model counts if needed
    if ('isPremium' in updates && updates.isPremium !== originalContent.isPremium) {
      const update = updates.isPremium
        ? { $inc: { premiumContentCount: 1 } }
        : { $inc: { premiumContentCount: -1 } };
      
      await Model.findByIdAndUpdate(content.modelId, update);
    }
    
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// Delete content (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    // Get content before deletion to know model and premium status
    const content = await Content.findById(id);
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    // Delete from S3 if file URLs contain file keys
    const fileUrl = content.fileUrl;
    const thumbnailUrl = content.thumbnailUrl;
    
    if (fileUrl && fileUrl.includes(process.env.AWS_BUCKET_NAME)) {
      const fileKey = fileUrl.split('/').slice(-2).join('/');
      await deleteFromS3(fileKey);
    }
    
    if (thumbnailUrl && thumbnailUrl.includes(process.env.AWS_BUCKET_NAME)) {
      const thumbnailKey = thumbnailUrl.split('/').slice(-2).join('/');
      await deleteFromS3(thumbnailKey);
    }
    
    // Delete content from database
    await Content.findByIdAndDelete(id);
    
    // Update model counts
    await Model.findByIdAndUpdate(content.modelId, {
      $inc: {
        contentCount: -1,
        ...(content.isPremium ? { premiumContentCount: -1 } : {}),
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}