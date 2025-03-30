// app/api/models/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Model from '@/models/Model';
import Content from '@/models/Content';
import { getCurrentUser } from '@/lib/auth';

// Get all models with basic info
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    await connectToDatabase();
    
    const models = await Model.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

// Create a new model (admin only)
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { name, description, thumbnailUrl, tags } = await request.json();
    
    if (!name || !description || !thumbnailUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const model = await Model.create({
      name,
      description,
      thumbnailUrl,
      tags: tags || [],
    });
    
    return NextResponse.json(
      { success: true, model },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    );
  }
}