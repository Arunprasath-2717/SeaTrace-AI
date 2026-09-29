import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  fluid = false,
}) => {
  return (
    <div
      className={`w-full h-full flex-1 p-4 md:p-6 overflow-y-auto ${
        fluid ? 'max-w-none' : 'max-w-7xl mx-auto'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default PageContainer;
