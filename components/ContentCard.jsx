// components/ContentCard.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ContentCard({ content, showModel = false }) {
  const { data: session } = useSession();
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  const isPremium = content.isPremium;
  const userCanAccess = !isPremium || session?.user?.membershipStatus === 'premium';
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative group">
      <div className="relative h-64 w-full bg-gray-900">
        {userCanAccess ? (
          <Link href={`/content/${content._id}`}>
            <div className="relative h-full w-full">
              <Image
                src={content.thumbnailUrl}
                alt={content.title}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoadingComplete={() => setIsImageLoading(false)}
              />
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={content.thumbnailUrl}
              alt={content.title}
              fill
              className="object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-yellow-500 mb-2"
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
              <span className="text-white font-medium">Premium Content</span>
              <Link
                href="/membership"
                className="mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm px-4 py-2 rounded-md hover:from-purple-600 hover:to-blue-600"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-white">{content.title}</h3>
        
        {showModel && content.modelId && (
          <p className="text-sm text-gray-400 mt-1">
            Model: {typeof content.modelId === 'object' ? content.modelId.name : 'Unknown'}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">
            {new Date(content.createdAt).toLocaleDateString()}
          </span>
          {content.isPremium && (
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded">
              Premium
            </span>
          )}
        </div>
      </div>
    </div>
  );
}