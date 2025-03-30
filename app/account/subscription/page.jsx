
// app/account/subscription/page.js
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export default async function SubscriptionPage({ searchParams }) {
  const user = await requireAuth();
  const isSuccess = searchParams?.success === 'true';
  
  try {
    await connectToDatabase();
    const dbUser = await User.findById(user.id);
    
    if (!dbUser) {
      redirect('/login');
    }
    
    const isPremium = dbUser.membershipStatus === 'premium';
    
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
          
          {isSuccess && (
            <div className="bg-green-800 text-green-200 p-4 rounded-md mb-8">
              <p className="font-medium">
                Your subscription has been updated successfully.
              </p>
            </div>
          )}
          
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {isPremium ? 'Premium Membership' : 'Free Account'}
                  </h2>
                  <p className="text-gray-400">
                    {isPremium
                      ? 'You have access to all premium content'
                      : 'Upgrade to access premium content'}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      isPremium
                        ? 'bg-green-900 text-green-200'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {isPremium ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              {isPremium && dbUser.subscriptionId && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Subscription ID</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {dbUser.subscriptionId}
                      </p>
                    </div>
                    <form action="/api/membership/customer-portal" method="POST">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Manage Subscription
                      </button>
                    </form>
                  </div>
                </div>
              )}
              
              {!isPremium && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <Link
                    href="/membership"
                    className="block w-full bg-gradient-to-r from-purple-500 to-blue-500 text-center text-white px-4 py-2 rounded hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Subscription Benefits</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mr-2 ${
                      isPremium ? 'text-green-500' : 'text-gray-500'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Access to premium content</span>
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mr-2 ${
                      isPremium ? 'text-green-500' : 'text-gray-500'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Early access to new releases</span>
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mr-2 ${
                      isPremium ? 'text-green-500' : 'text-gray-500'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>HD quality videos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-900 text-red-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>Failed to load subscription data. Please try again later.</p>
        </div>
      </div>
    );
  }
}
