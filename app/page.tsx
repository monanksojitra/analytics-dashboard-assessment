export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Electric Vehicle Analytics Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Exploring 50,000+ Electric Vehicles across Washington State
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Placeholder metrics cards */}
          {[
            { label: "Total EVs", value: "50,000+", icon: "⚡" },
            { label: "BEV Vehicles", value: "70%", icon: "🔋" },
            { label: "Avg Range", value: "150 mi", icon: "📏" },
            { label: "Top County", value: "King", icon: "📍" },
          ].map((metric, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{metric.icon}</span>
                <span className="text-sm text-muted-foreground">
                  {metric.label}
                </span>
              </div>
              <div className="text-3xl font-bold text-primary">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Dashboard Coming Soon</h2>
          <p className="text-muted-foreground mb-4">
            This is a placeholder page. The full dashboard with interactive
            charts, maps, and analytics is being built.
          </p>
          <div className="space-y-2 text-sm">
            <p>✅ Next.js 14 setup complete</p>
            <p>✅ Dependencies installed</p>
            <p>⏳ Database setup in progress</p>
            <p>⏳ Dashboard components coming next</p>
          </div>
        </div>
      </div>
    </main>
  );
}
