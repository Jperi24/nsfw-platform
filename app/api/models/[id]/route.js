// app/api/models/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Model from '@/models/Model';
import Content from '@/models/Content';
import { getCurrentUser } from '@/lib/auth';

// Get a specific model with content preview
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    const isFree = !user || user.membershipStatus === 'free';
    
    await connectToDatabase();
    
    const model = await Model.findById(id);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Get content for this model
    // For free users, only fetch non-premium content
    const contentQuery = { modelId: id };
    if (isFree) {
      contentQuery.isPremium = false;
    }
    
    const content = await Content.find(contentQuery)
      .sort({ createdAt: -1 })
      .limit(30);
    
    return NextResponse.json({
      model,
      content,
      isPremium: !isFree,
    });
  } catch (error) {
    console.error('Error fetching model:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    );
  }
}

// Update a model (admin only)
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
    
    const model = await Model.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, model });
  } catch (error) {
    console.error('Error updating model:', error);
    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    );
  }
}

// Delete a model (admin only)
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
    
    // Delete all content associated with this model
    await Content.deleteMany({ modelId: id });
    
    // Delete the model
    const model = await Model.findByIdAndDelete(id);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    );
  }
}