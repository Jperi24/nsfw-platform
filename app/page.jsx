// app/page.js
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg" // This would be a placeholder image
            alt="Hero background"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Premium Content for True Enthusiasts
            </h1>
            <p className="text-xl text-gray-200 mt-6">
              Access our exclusive library of premium content with a monthly subscription.
              Browse our collection with high-quality images and videos.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/browse"
                className="bg-white text-gray-900 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Browse Content
              </Link>
              <Link
                href="/membership"
                className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3 rounded-md text-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                Join Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Models</h2>
            <p className="text-gray-400 mt-2">
              Discover our most popular content creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* This would be populated with actual featured models data */}
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-gray-700 rounded-lg overflow-hidden shadow-md transition-transform hover:-translate-y-2"
              >
                <div className="relative h-64 w-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-semibold">Featured Model {item}</h3>
                    <p className="text-gray-300 text-sm">Exclusive content creator</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/models"
              className="inline-block border border-white px-6 py-2 rounded-md hover:bg-white hover:text-gray-900 transition-colors"
            >
              View All Models
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Premium Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose Premium</h2>
            <p className="text-gray-400 mt-2">
              The benefits of upgrading to our premium membership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Content</h3>
              <p className="text-gray-400">
                Access our entire library of premium content not available to free users.
              </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality</h3>
              <p className="text-gray-400">
                Enjoy HD quality videos and high-resolution images in our premium tier.
              </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Regular Updates</h3>
              <p className="text-gray-400">
                New content added weekly, with premium members getting early access.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/membership"
              className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3 rounded-md text-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}