import { FC } from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export const Button: FC<Props> = ({ children, ...props }) => {
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      {...props}
    >
      {children}
    </button>
  );
};
