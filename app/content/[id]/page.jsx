// app/content/[id]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import connectToDatabase from '@/lib/mongodb';
import Content from '@/models/Content';
import Model from '@/models/Model';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ContentPage({ params }) {
  const { id } = params;
  const user = await getCurrentUser();
  
  try {
    await connectToDatabase();
    
    const content = await Content.findById(id).populate('modelId');
    
    if (!content) {
      return notFound();
    }
    
    // Check premium access
    if (content.isPremium && (!user || user.membershipStatus !== 'premium')) {
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-yellow-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h1 className="text-3xl font-bold mb-4">Premium Content</h1>
            <p className="text-xl text-gray-300 mb-8">
              This content is only available for premium members.
            </p>
            <Link
              href="/membership"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-md text-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
            >
              Upgrade to Premium
            </Link>
            <Link
              href="/"
              className="block mt-4 text-blue-400 hover:underline"
            >
              Return to homepage
            </Link>
          </div>
        </div>
      );
    }
    
    // Related content
    const relatedContent = await Content.find({
      modelId: content.modelId,
      _id: { $ne: content._id },
      isPremium: user?.membershipStatus === 'premium' ? undefined : false,
    })
      .limit(6)
      .sort({ createdAt: -1 });
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/models/${content.modelId._id}`}
            className="text-blue-400 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to {content.modelId.name}
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
        
        {content.isPremium && (
          <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded mb-4">
            Premium
          </span>
        )}
        
        <div className="mb-8">
          {content.contentType === 'image' ? (
            <div className="relative w-full" style={{ maxHeight: '80vh' }}>
              <Image
                src={content.fileUrl}
                alt={content.title}
                width={1200}
                height={800}
                className="rounded-lg max-h-[80vh] mx-auto object-contain"
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video">
              <video
                src={content.fileUrl}
                controls
                className="rounded-lg w-full h-full object-contain bg-black"
                poster={content.thumbnailUrl}
              />
            </div>
          )}
        </div>
        
        {content.description && (
          <div className="bg-gray-800 p-4 rounded-lg mb-8">
            <p className="text-gray-300">{content.description}</p>
          </div>
        )}
        
        {content.tags && content.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {relatedContent.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">More from {content.modelId.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContent.map((item) => (
                <Link key={item._id} href={`/content/${item._id}`}>
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      {item.isPremium && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded">
                            Premium
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching content:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-900 text-red-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>Failed to load content. Please try again later.</p>
        </div>
      </div>
    );
  }
}