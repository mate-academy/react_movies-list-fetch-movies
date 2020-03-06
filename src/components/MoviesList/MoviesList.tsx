import React, { FC } from 'react';

import { MovieCard } from '../MovieCard';

import { MovieForApp } from '../../constants/types';
import './MoviesList.scss';

type Props = {
  movies: MovieForApp[];
};


export const MoviesList: FC<Props> = (props) => {
  const { movies } = props;

  return (
    <div className="movies">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbId}
          movie={movie}
        />
      ))}
    </div>
  );
};
