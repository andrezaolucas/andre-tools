interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-8 animate-pulse">
      <div className="flex-between mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-xl" />
        <div className="w-6 h-6 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="h-6 w-3/4 bg-gray-200 rounded-md" />
        <div className="h-4 w-full bg-gray-200 rounded-md" />
      </div>
    </div>
  );
}

export function FileSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100">
        <div className="w-full h-full flex-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-5 w-3/4 bg-gray-200 rounded-md" />
        <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
}

export function TranscriptionSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded-md" />
              <div className="h-4 w-32 bg-gray-200 rounded-md" />
            </div>
          </div>
          <div className="w-24 h-4 bg-gray-200 rounded-md" />
        </div>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex space-x-3">
          <div className="w-24 h-9 bg-gray-200 rounded-lg" />
          <div className="w-24 h-9 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-64 bg-gray-100 rounded-lg p-6">
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded-md"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
