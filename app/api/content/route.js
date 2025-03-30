
// app/api/content/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Content from '@/models/Content';
import Model from '@/models/Model';
import { getCurrentUser } from '@/lib/auth';

// Get all content (with filtering options)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');
    const isPremium = searchParams.get('isPremium');
    const contentType = searchParams.get('contentType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const user = await getCurrentUser();
    const isFree = !user || user.membershipStatus === 'free';
    
    await connectToDatabase();
    
    // Build query
    const query = {};
    
    // Filter by model
    if (modelId) {
      query.modelId = modelId;
    }
    
    // Filter by content type
    if (contentType) {
      query.contentType = contentType;
    }
    
    // Handle premium content access
    if (isPremium === 'true') {
      // Only premium users can request premium content
      if (isFree) {
        return NextResponse.json(
          { error: 'Premium membership required' },
          { status: 403 }
        );
      }
      query.isPremium = true;
    } else if (isPremium === 'false') {
      query.isPremium = false;
    } else if (isFree) {
      // Free users can only see non-premium content
      query.isPremium = false;
    }
    
    // Get total count for pagination
    const total = await Content.countDocuments(query);
    
    // Fetch content with pagination
    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('modelId', 'name');
    
    return NextResponse.json({
      content,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// Create new content (admin only)
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const contentData = await request.json();
    const { title, modelId, fileUrl, thumbnailUrl, contentType, isPremium } = contentData;
    
    if (!title || !modelId || !fileUrl || !thumbnailUrl || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Verify model exists
    const model = await Model.findById(modelId);
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Create content
    const content = await Content.create(contentData);
    
    // Update content counts on the model
    await Model.findByIdAndUpdate(modelId, {
      $inc: {
        contentCount: 1,
        ...(isPremium ? { premiumContentCount: 1 } : {}),
      },
    });
    
    return NextResponse.json(
      { success: true, content },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}