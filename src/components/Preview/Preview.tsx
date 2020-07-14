import React, { FC } from 'react';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../interfaces/Movie';

type Props = {
  isLoading: boolean;
  preview: Movie | null;
};

export const Preview: FC<Props> = ({ isLoading, preview }) => {
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (preview === null) {
    return <span>Your matches display here.</span>;
  }

  return <MovieCard {...preview} />;
};
