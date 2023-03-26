import classnames from 'classnames';
import { memo } from 'react';
import { ButtonTypes } from '../../types/ButtonTypes';

export const Button: React.FC<ButtonTypes> = memo(
  ({
    type,
    dataCy,
    content,
    loading,
    className,
    onClick,
    disabled = false,
  }) => (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      data-cy={dataCy}
      disabled={disabled}
      className={classnames(
        'button',
        className,
        { 'is-loading': loading },
      )}
      onClick={onClick}
    >
      {content}
    </button>
  ),
);
