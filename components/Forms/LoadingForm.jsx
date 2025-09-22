export default function LoadingForm() {
  return (
    <div className="animate-pulse bg-gray-100 rounded-lg p-4">
      <div className="w-[100px] h-[100px] bg-gray-200 rounded-full mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
