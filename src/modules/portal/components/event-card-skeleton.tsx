export function EventCardSkeleton() {
  return (
    <div className="border rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex items-center mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex items-center mb-4">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}
