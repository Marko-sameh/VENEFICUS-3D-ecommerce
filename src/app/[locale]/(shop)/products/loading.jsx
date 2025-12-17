import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ProductsLoading() {
  return (
    <div className="bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="h-96 bg-[var(--card-bg)] rounded-lg animate-pulse" />
          </aside>
          <main className="lg:col-span-3">
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}