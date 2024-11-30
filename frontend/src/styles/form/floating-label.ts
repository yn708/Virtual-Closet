export const floatingLabelStyles = {
  wrapper: 'space-y-2',
  container: 'relative',
  label: 'absolute left-4 transition-all duration-200 pointer-events-none',
  labelState: {
    active: 'text-xs top-2 opacity-65',
    inactive: 'text-sm top-1/2 -translate-y-1/2 opacity-65',
  },
  labelColor: {
    default: 'text-gray-500',
    focused: 'text-blue-500',
    error: 'text-red-500',
  },
  input: {
    base: 'h-14 px-4 transition-all duration-200 placeholder:text-transparent focus:placeholder:text-gray-400',
    state: {
      active: 'pt-6 pb-2',
      inactive: 'py-3',
    },
    border: {
      default: 'border-gray-300',
      focused: 'border-blue-500',
      error: 'border-red-500',
    },
    password: 'pr-10',
  },
  passwordToggle:
    'absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-full p-1',
};
