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

        <div className="mt-8 space-x-4">
          <a
            href="/auth/login"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="inline-block px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}
