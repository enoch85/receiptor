export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-green-600">🧾 Receiptor</h1>
        <h2 className="text-2xl font-semibold mb-2">Smart Household Budget Tracker</h2>
        <p className="text-gray-600 mb-8">Track your grocery spending with AI-powered insights</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">✅ Phase 1-3 Complete</h3>
            <p className="text-sm text-gray-600">Database, business logic, and 75 tests passing</p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">📱 Phase 4 In Progress</h3>
            <p className="text-sm text-gray-600">Mobile app foundation with React Native</p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-green-50">
            <h3 className="font-bold text-lg mb-2">🌐 Phase 5 Starting</h3>
            <p className="text-sm text-gray-600">Web app with Next.js 14 (you are here!)</p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">🐳 Docker Ready</h3>
            <p className="text-sm text-gray-600">Full stack testing environment</p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Environment Status</h3>
          <p className="text-sm text-gray-700">
            Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}
          </p>
          <p className="text-sm text-gray-700">
            API Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'}
          </p>
        </div>

        {/* BankID Support Badge */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="font-semibold text-blue-900">Bank-Grade Nordic Authentication</h3>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-blue-700">
              <span className="text-lg">🇸🇪</span>
              <span className="font-medium">BankID</span>
            </span>
            <span className="text-blue-300">•</span>
            <span className="flex items-center gap-1 text-blue-700">
              <span className="text-lg">🇳🇴</span>
              <span className="font-medium">Vipps</span>
            </span>
            <span className="text-blue-300">•</span>
            <span className="flex items-center gap-1 text-blue-700">
              <span className="text-lg">🇩🇰</span>
              <span className="font-medium">MitID</span>
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-2 text-center">
            Fast, secure sign-in with your national ID
          </p>
        </div>

        <div className="mt-6 space-x-4">
          <a
            href="/auth/login"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
          >
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="inline-block px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
          >
            Sign Up
          </a>
        </div>
        <p className="mt-3 text-xs text-gray-500">🔐 Email, Google, Apple, or BankID</p>
      </div>
    </main>
  );
}
