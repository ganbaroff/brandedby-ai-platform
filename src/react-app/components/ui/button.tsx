import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode; variant?: string; size?: string };

export const Button = (props: Props) => {
  const { children, className = '', ...rest } = props;
  return (
    <button className={`px-3 py-2 rounded bg-blue-600 text-white ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
