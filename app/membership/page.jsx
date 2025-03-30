/ app/membership/page.js
import MembershipCard from '@/components/MembershipCard';
import { getCurrentUser } from '@/lib/auth';

export default async function MembershipPage({ searchParams }) {
  const user = await getCurrentUser();
  const isPremium = user?.membershipStatus === 'premium';
  const isCanceled = searchParams?.canceled === 'true';
  const isSuccess = searchParams?.success === 'true';

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            {isPremium ? 'Your Premium Membership' : 'Upgrade to Premium'}
          </h1>
          <p className="text-xl text-gray-300 mt-4">
            {isPremium
              ? 'Manage your premium membership'
              : 'Get unlimited access to all premium content'}
          </p>
        </div>

        {isSuccess && !isPremium && (
          <div className="bg-green-800 text-green-200 p-4 rounded-md mb-8">
            <p className="font-medium">
              Your payment is being processed. Your membership will be upgraded shortly.
            </p>
          </div>
        )}

        {isCanceled && (
          <div className="bg-yellow-800 text-yellow-200 p-4 rounded-md mb-8">
            <p className="font-medium">
              Your payment was canceled. You can try again whenever you're ready.
            </p>
          </div>
        )}

        <MembershipCard />

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Premium Benefits</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-blue-600 p-2 rounded-md mr-4">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">High Quality</h3>
                  <p className="text-gray-400">
                    Enjoy high definition videos and high resolution images.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-yellow-600 p-2 rounded-md mr-4">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cancel Anytime</h3>
                  <p className="text-gray-400">
                    No long-term commitment. You can cancel your subscription at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How does billing work?</h3>
              <p className="text-gray-400">
                You'll be charged $4.99 monthly until you cancel your subscription.
                We use Stripe for secure payment processing.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have
                premium access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I manage my subscription?</h3>
              <p className="text-gray-400">
                Once you're a premium member, you can manage your subscription from your
                account settings page or by clicking "Manage Subscription" on this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
