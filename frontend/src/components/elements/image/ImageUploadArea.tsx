import { ALLOWED_IMAGE_EXTENSIONS } from '@/utils/constants';
import { IoIosAlert } from 'react-icons/io';
import { MdOutlineFileUpload } from 'react-icons/md';

const ImageUploadArea = () => {
  return (
    <label
      htmlFor="image-upload"
      className="relative group flex flex-col items-center justify-center rounded-xl cursor-pointer bg-gray-100 dark:bg-gray-900 min-h-28 md:min-h-64 w-full transition-all duration-300 hover:bg-gray-50"
    >
      <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-xl m-2 md:m-4 transition-all duration-300 group-hover:scale-[0.98]" />
      <div className="flex flex-col items-center justify-center p-4 md:p-6 z-10 w-full">
        <MdOutlineFileUpload className="size-8 md:size-16 text-gray-400 mb-2 md:mb-4 transition-transform duration-300 group-hover:scale-110" />
        <p className="mb-1 md:mb-2 text-xs md:text-sm text-gray-500 font-medium dark:text-gray-400">
          クリックして画像をアップロード
        </p>
        <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
          対応形式: {ALLOWED_IMAGE_EXTENSIONS.join(', ')}
        </p>
        <div className="flex justify-center items-center text-gray-500 dark:text-gray-400 opacity-70 gap-1 mt-3 md:mt-5 max-w-[90%] md:max-w-full">
          <IoIosAlert className="size-3 md:size-4" />
          <span className="text-[8px] md:text-[10px] text-center">
            容量が大きい場合、画質が下がる可能性があります。
          </span>
        </div>
      </div>
    </label>
  );
};

export default ImageUploadArea;
