export const toggleGroupStyles = {
  label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
  group: 'flex flex-wrap gap-1.5 sm:gap-2',
  item: `group relative px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full border-2 border-gray-200 dark:border-gray-800
              text-xs sm:text-sm font-medium overflow-hidden
              transition-all duration-200 ease-in-out
              hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950
              data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:border-blue-500
              data-[state=on]:shadow-sm`,
  itemContent: `flex items-center justify-center relative w-full
                     before:content-[''] before:size-3 sm:before:size-4 before:opacity-0
                     after:content-[''] after:size-3 sm:after:size-4 after:opacity-0`,
  icon: `absolute left-0 size-3 sm:size-4 opacity-0 -translate-x-full
              group-data-[state=on]:opacity-100 group-data-[state=on]:translate-x-0
              transition-all duration-200 ease-in-out`,
  text: `transition-all duration-200 ease-in-out
              group-data-[state=on]:translate-x-1.5 sm:group-data-[state=on]:translate-x-2`,
  error: 'text-xs text-destructive',
} as const;
