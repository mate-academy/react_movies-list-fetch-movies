import React from 'react';

type Props = {
  message: string;
};

export const ErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <p className="help is-danger" data-cy="errorMessage">
      {message}
    </p>
  );
};
