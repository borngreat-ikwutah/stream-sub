import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            TanStack Start + Tailwind CSS v4 + Drizzle ORM with PostgreSQL
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">TanStack Start</h3>
              <p className="text-gray-600">
                Full-stack React framework with file-based routing
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Tailwind CSS v4</h3>
              <p className="text-gray-600">
                Latest version with modern @import and @theme syntax
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Drizzle ORM</h3>
              <p className="text-gray-600">
                TypeScript ORM configured for PostgreSQL
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <div className="text-left max-w-2xl mx-auto">
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Copy <code className="bg-gray-200 px-2 py-1 rounded">.env.example</code> to <code className="bg-gray-200 px-2 py-1 rounded">.env</code></li>
                <li>Configure your PostgreSQL database credentials</li>
                <li>Run <code className="bg-gray-200 px-2 py-1 rounded">npm run db:generate</code> to generate migrations</li>
                <li>Run <code className="bg-gray-200 px-2 py-1 rounded">npm run db:push</code> to push schema to database</li>
                <li>Start building your database schema in <code className="bg-gray-200 px-2 py-1 rounded">src/db/schema/</code></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
});
