import Skeleton from "react-loading-skeleton";

const SkeletonClass = () => {
    return (
        <div className="relative">
            <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-4 w-full flex flex-col items-center justify-center">
                {/* Class name skeleton */}
                <div className="w-full">
                    <Skeleton height={100} className="rounded-lg" />
                </div>
                {/* Date and time skeleton */}
                <div className="w-full flex justify-between gap-2 mt-2">
                    <Skeleton containerClassName="flex-1" height={24} />
                    <Skeleton containerClassName="flex-1" height={24} />
                </div>
            </div>
            {/* Options button skeleton */}
            <div className="absolute top-2 right-2">
                <Skeleton circle width={42} height={42} />
            </div>
        </div>
    );
}


export default SkeletonClass;