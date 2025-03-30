
// app/admin/dashboard/page.js
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Model from '@/models/Model';
import Content from '@/models/Content';

export default async function AdminDashboard() {
  await requireAdmin();
  
  try {
    await connectToDatabase();
    
    // Get stats
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ membershipStatus: 'premium' });
    const totalModels = await Model.countDocuments();
    const totalContent = await Content.countDocuments();
    const premiumContent = await Content.countDocuments({ isPremium: true });
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get recent content
    const recentContent = await Content.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('modelId', 'name');
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-400 mb-2">Total Users</h2>
            <p className="text-4xl font-bold">{totalUsers}</p>
            <div className="mt-4 text-sm">
              <span className="text-green-400">{premiumUsers}</span> premium users
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-400 mb-2">Total Models</h2>
            <p className="text-4xl font-bold">{totalModels}</p>
            <div className="mt-4 text-sm">
              <Link href="/admin/models" className="text-blue-400 hover:underline">
                Manage models
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-400 mb-2">Total Content</h2>
            <p className="text-4xl font-bold">{totalContent}</p>
            <div className="mt-4 text-sm">
              <span className="text-purple-400">{premiumContent}</span> premium items
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Users</h2>
              <Link
                href="/admin/users"
                className="text-sm text-blue-400 hover:underline"
              >
                View all
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-700">
                      <td className="py-3">{user.name}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            user.membershipStatus === 'premium'
                              ? 'bg-green-900 text-green-200'
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {user.membershipStatus}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Content</h2>
              <Link
                href="/admin/content"
                className="text-sm text-blue-400 hover:underline"
              >
                View all
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-2">Title</th>
                    <th className="pb-2">Model</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {recentContent.map((content) => (
                    <tr key={content._id} className="border-b border-gray-700">
                      <td className="py-3">
                        <Link
                          href={`/content/${content._id}`}
                          className="hover:text-blue-400"
                        >
                          {content.title}
                        </Link>
                      </td>
                      <td className="py-3">
                        {content.modelId ? (
                          <Link
                            href={`/models/${content.modelId._id}`}
                            className="hover:text-blue-400"
                          >
                            {content.modelId.name}
                          </Link>
                        ) : (
                          'Unknown'
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            content.contentType === 'video'
                              ? 'bg-blue-900 text-blue-200'
                              : 'bg-indigo-900 text-indigo-200'
                          }`}
                        >
                          {content.contentType}
                        </span>
                      </td>
                      <td className="py-3">
                        {content.isPremium ? (
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-purple-900 text-purple-200">
                            Premium
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-400">
                            Free
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Link
            href="/admin/upload"
            className="bg-blue-600 hover:bg-blue-700 text-center p-6 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="block text-xl font-medium">Upload Content</span>
          </Link>
          
          <Link
            href="/admin/models/add"
            className="bg-green-600 hover:bg-green-700 text-center p-6 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <span className="block text-xl font-medium">Add Model</span>
          </Link>
          
          <Link
            href="/admin/stats"
            className="bg-purple-600 hover:bg-purple-700 text-center p-6 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="block text-xl font-medium">View Stats</span>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-900 text-red-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>Failed to load dashboard data. Please try again later.</p>
        </div>
      </div>
    );
  }
}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Unlimited Access</h3>
                  <p className="text-gray-400">
                    Access our entire library of premium content without restrictions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-purple-600 p-2 rounded-md mr-4">
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
                <div>
                  <h3 className="text-xl font-semibold mb-2">New Content First</h3>
                  <p className="text-gray-400">
                    Premium members get early access to new content before anyone else.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-green-600 p-2 rounded-md mr-4">
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
                  