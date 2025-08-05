export default function RecentPlaysLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Thumbnail list skeleton */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex-none w-32 h-32 bg-gray-200 rounded-lg"
          />
        ))}
      </div>
      
      {/* Recent plays list skeleton */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-none" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded-sm w-3/4" />
              <div className="h-3 bg-gray-200 rounded-sm w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
