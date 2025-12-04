import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { className?: string };

export const Input = (props: Props) => {
  const { className = '', ...rest } = props;
  return <input className={`border rounded px-2 py-1 ${className}`} {...rest} />;
};

export default Input;
