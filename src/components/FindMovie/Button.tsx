import classNames from 'classnames';
import React from 'react';

type Props = {
  type: 'submit' | 'button' | 'reset' | undefined;
  className: string;
  data: string;
  content: string;
  isDidabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
};

export const Button: React.FC<Props> = ({
  type,
  className,
  data,
  content,
  isDidabled = false,
  isLoading = false,
  onClick = () => {},
}) => {
  return (
    <button
      data-cy={data}
      type={type}
      className={classNames(className, { 'is-loading': isLoading })}
      disabled={isDidabled}
      onClick={onClick}
    >
      {content}
    </button>
  );
};
