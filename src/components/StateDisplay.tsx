import React from 'react';

interface StateProps {
  iconSrc: string;
  title: string;
  message: string;
  altText?: string;
  iconSize?: string; // You can customize the icon size, defaulting to w-24 h-24
}

function StateDisplay({ iconSrc, title, message, altText = "State Icon", iconSize = "w-24 h-24" }: StateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <img src={iconSrc} alt={altText} className={`${iconSize} mb-4`} />
      <h2 className="text-xl font-semibold text-[#0c55e9]">{title}</h2>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

export default StateDisplay;
