import type { CheckboxProps } from '@/types';

const CheckboxField = ({ name, label, error, defaultChecked = false, onChange }: CheckboxProps) => {
  return (
    <div className="flex flex-row items-start space-x-3 space-y-0 p-4">
      <div className="relative">
        <input
          type="checkbox"
          id={name}
          name={name}
          value="true"
          defaultChecked={defaultChecked}
          onChange={onChange}
          className="peer size-5 appearance-none rounded-md border-2 border-gray-300 checked:border-blue-500 
            checked:bg-blue-500 hover:border-blue-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all
            duration-200 cursor-pointer"
        />
        {/* チェックマークアイコン */}
        <svg
          className="absolute left-0.5 top-0.5 size-4 pointer-events-none opacity-0 peer-checked:opacity-100 
            text-white transition-opacity duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 cursor-pointer select-none
          hover:text-gray-900 transition-colors duration-200"
      >
        {label}
      </label>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default CheckboxField;
