import { Skeleton } from '@/components/ui/skeleton';

export default function ItemEditorFormSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-10 gap-0">
        {/* 画像アップロードエリア */}
        <div className="col-span-2 p-4">
          <Skeleton className="w-full h-40 md:h-96 rounded-lg" />
        </div>

        {/* 詳細情報エリア */}
        <div className="col-span-3">
          <div className="space-y-3 p-3">
            <div className="space-y-1">
              <Skeleton className="w-full h-14 rounded-lg" />
            </div>

            <div className="space-y-1">
              <Skeleton className="w-full h-14 rounded-lg" />
            </div>

            <div className="space-y-1">
              <Skeleton className="w-full h-14 rounded-lg" />
            </div>

            <div className="space-y-1">
              <Skeleton className="w-full h-14 rounded-lg" />
            </div>

            <div className="space-y-1">
              <Skeleton className="w-full h-14 rounded-lg" />
            </div>

            <div className="my-7">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-[120px] rounded-full" />
                ))}
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <div className="flex items-center space-x-3 p-4">
                <Skeleton className="size-5 rounded-md" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex items-center space-x-3 p-4">
                <Skeleton className="size-5 rounded-md" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <Skeleton className="w-full md:w-1/3 h-[50px] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
