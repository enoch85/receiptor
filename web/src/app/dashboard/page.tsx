/**
 * Dashboard Page
 * Main view after successful authentication
 */

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Receiptor</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-sm text-blue-600 hover:text-blue-500">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Receiptor! 🎉</h2>
              <p className="text-gray-600">
                You've successfully authenticated with{' '}
                {user.user_metadata?.full_name ? (
                  <span className="font-medium">{user.user_metadata.full_name}</span>
                ) : (
                  <span className="font-medium">{user.email}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Authenticated
            </div>
          </div>
        </div>

        {/* Auth Method Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">✅ Authentication Working!</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>User ID:</strong>{' '}
              <code className="bg-blue-100 px-2 py-1 rounded">{user.id}</code>
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.user_metadata?.full_name && (
              <p>
                <strong>Full Name:</strong> {user.user_metadata.full_name}
              </p>
            )}
            {user.user_metadata?.household_name && (
              <p>
                <strong>Household:</strong> {user.user_metadata.household_name}
              </p>
            )}
            <p>
              <strong>Auth Provider:</strong> {user.app_metadata?.provider || 'email'}
            </p>
            <p>
              <strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Quick Stats (Placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Receipts</h3>
              <span className="text-2xl">🧾</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">No receipts uploaded yet</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">This Month</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0 SEK</p>
            <p className="text-xs text-gray-500 mt-1">No spending tracked</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Household Members</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">1</p>
            <p className="text-xs text-gray-500 mt-1">Just you for now</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Next Steps</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Upload your first receipt</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Connect to your grocery store or manually upload a receipt to start tracking
                </p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-500 font-medium">
                  Coming soon →
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Set your budget</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Define monthly spending goals to track your household grocery budget
                </p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-500 font-medium">
                  Coming soon →
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Invite household members</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Add family members or roommates to share receipts and budgets
                </p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-500 font-medium">
                  Coming soon →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Info */}
        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-4">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              🔧 Developer Info
            </summary>
            <div className="mt-3 space-y-2 text-xs text-gray-600">
              <p>
                <strong>Status:</strong> Authentication working ✅
              </p>
              <p>
                <strong>Next:</strong> Build receipt upload, budget management, and household
                features
              </p>
              <p>
                <strong>Todo:</strong> See docs/CURRENT_STATUS_REALITY_CHECK.md for roadmap
              </p>
              <pre className="mt-3 bg-white p-3 rounded border border-gray-300 overflow-x-auto">
                {JSON.stringify(
                  {
                    user_id: user.id,
                    email: user.email,
                    provider: user.app_metadata?.provider,
                    metadata: user.user_metadata,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </details>
        </div>
      </main>
    </div>
  );
}
