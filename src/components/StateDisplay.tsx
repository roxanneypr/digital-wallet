import React from 'react';

interface StateProps {
  iconSrc: string;
  title: string;
  message: string;
  altText?: string;
  iconSize?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

function StateDisplay({
  iconSrc,
  title,
  message,
  altText = 'State Icon',
  iconSize = 'w-24 h-24',
  showButton = false,
  buttonText = 'Click Here',
  onButtonClick,
}: StateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <img src={iconSrc} alt={altText} className={`${iconSize} mb-4`} />
      <h2 className="text-xl font-semibold text-[#0c55e9]">{title}</h2>
      <p className="text-gray-600">{message}</p>
      {showButton && (
        <button
          onClick={onButtonClick}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default StateDisplay;
