import React from "react";

type Props = {
  onRetry?: () => void;
};

const Error: React.FC<Props> = ({ onRetry }: Props) => {
  return (
    <div className="flex justify-center items-center h-[15rem]">
      <div className="text-red-500 text-lg font-semibold">
        An error occurred while fetching data. Please try again later.
      </div>
      <button className="button py-1 px-1" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
};

export default Error;
