export const toggleGroupStyles = {
  label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
  group: 'flex flex-wrap gap-2',
  item: `group relative px-4 py-2 rounded-full border-2 border-gray-200 dark:border-gray-800
         text-sm font-medium overflow-hidden
         transition-all duration-200 ease-in-out
         hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950
         data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:border-blue-500
         data-[state=on]:shadow-sm`,
  itemContent: 'flex items-center justify-around gap-2',
  icon: `size-4 hidden
         group-data-[state=on]:block 
         transition-all duration-200 ease-in-out`,
  text: 'transition-all duration-200',
  error: 'text-xs text-destructive',
} as const;
