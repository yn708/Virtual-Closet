import type { ToggleSwitchProps } from '@/types';

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  className = '',
  disabled = false,
}) => (
  <label
    className={`inline-flex items-center ${
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
    } ${className}`}
  >
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <div
      className={`
        relative w-11 h-6 bg-gray-200 
        peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
        dark:peer-focus:ring-blue-800 
        rounded-full peer 
        dark:bg-gray-700 
        peer-checked:after:translate-x-full 
        rtl:peer-checked:after:-translate-x-full 
        peer-checked:after:border-white 
        after:content-[''] 
        after:absolute 
        after:top-[2px] 
        after:start-[2px] 
        after:bg-white 
        after:border-gray-300 
        after:border 
        after:rounded-full 
        after:size-5 
        after:transition-all 
        dark:border-gray-600 
        peer-checked:bg-blue-600
        ${disabled ? 'peer-checked:bg-blue-400' : ''}
      `}
    />
    {label && <span className="ml-3 text-sm text-gray-600">{label}</span>}
  </label>
);

export default ToggleSwitch;
