
// app/models/page.js
import Link from 'next/link';
import ModelCard from '@/components/ModelCard';
import connectToDatabase from '@/lib/mongodb';
import Model from '@/models/Model';

export const dynamic = 'force-dynamic';

export default async function ModelsPage({ searchParams }) {
  try {
    await connectToDatabase();
    
    const models = await Model.find({}).sort({ createdAt: -1 });
    
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Browse Models</h1>
          <p className="text-gray-400 mt-2">
            Discover our collection of content creators
          </p>
        </div>
        
        {models.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No models found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {models.map((model) => (
              <ModelCard key={model._id} model={model} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching models:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-900 text-red-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>Failed to load models. Please try again later.</p>
        </div>
      </div>
    );
  }
}