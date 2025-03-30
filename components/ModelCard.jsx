// components/ModelCard.jsx
import Link from 'next/link';
import Image from 'next/image';

export default function ModelCard({ model }) {
  return (
    <Link href={`/models/${model._id}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-60 w-full">
          <Image 
            src={model.thumbnailUrl} 
            alt={model.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-white">{model.name}</h3>
          <p className="text-gray-400 mt-1 line-clamp-2">{model.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-400">
              {model.contentCount} items
            </span>
            {model.premiumContentCount > 0 && (
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded">
                Premium Content
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}