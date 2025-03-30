
// app/models/[id]/page.js
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ContentCard from '@/components/ContentCard';
import connectToDatabase from '@/lib/mongodb';
import Model from '@/models/Model';
import Content from '@/models/Content';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ModelPage({ params }) {
  const { id } = params;
  const user = await getCurrentUser();
  const isFree = !user || user.membershipStatus === 'free';
  
  try {
    await connectToDatabase();
    
    const model = await Model.findById(id);
    
    if (!model) {
      return notFound();
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
    
    return (
      <div>
        {/* Model header */}
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={model.thumbnailUrl}
            alt={model.name}
            fill
            className="object-cover brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold">{model.name}</h1>
              {model.tags && model.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Model content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-gray-300 leading-relaxed">
              {model.description}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-gray-800 px-4 py-2 rounded-md">
                <span className="text-gray-400 text-sm">Total content</span>
                <p className="text-2xl font-semibold">{model.contentCount}</p>
              </div>
              
              <div className="bg-gray-800 px-4 py-2 rounded-md">
                <span className="text-gray-400 text-sm">Premium content</span>
                <p className="text-2xl font-semibold">{model.premiumContentCount}</p>
              </div>
              
              {isFree && model.premiumContentCount > 0 && (
                <Link
                  href="/membership"
                  className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-md hover:from-purple-600 hover:to-blue-600 transition-colors"
                >
                  <span>Unlock Premium Content</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Content</h2>
            {isFree && model.premiumContentCount > 0 && (
              <p className="text-gray-400 mt-2">
                Showing {content.length} of {model.contentCount} items.{' '}
                <Link href="/membership" className="text-blue-400 hover:underline">
                  Upgrade to see all
                </Link>
              </p>
            )}
          </div>
          
          {content.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400">No content available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <ContentCard key={item._id} content={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching model:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-900 text-red-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>Failed to load model data. Please try again later.</p>
        </div>
      </div>
    );
  }
}
