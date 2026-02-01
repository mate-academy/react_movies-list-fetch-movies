import classNames from 'classnames';
import React from 'react';

type Props = {
  value: string;
  errorMessage: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<Props> = ({ value, onChange, errorMessage }) => {
  return (
    <input
      value={value}
      data-cy="titleField"
      type="text"
      id="movie-title"
      placeholder="Enter a title to search"
      className={classNames('input', { 'is-danger': errorMessage })}
      onChange={onChange}
    />
  );
};
