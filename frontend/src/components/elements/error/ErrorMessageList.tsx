import { type FC } from 'react';

interface ErrorMessageListProps {
  errors?: string[];
}

const ErrorMessageList: FC<ErrorMessageListProps> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <ul className="space-y-1">
      {errors.map((errorMsg, index) => (
        <li key={index} className="flex items-start text-sm text-red-500">
          {errorMsg}
        </li>
      ))}
    </ul>
  );
};

export default ErrorMessageList;
