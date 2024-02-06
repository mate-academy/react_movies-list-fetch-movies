import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  moviesList: Movie[];
};

export const MoviesList: React.FC<Props> = ({ moviesList }) => (
  <div className="movies">
    {moviesList.map(movie => (
      <MovieCard
        key={movie.imdbId}
        movie={movie}
      />
    ))}
  </div>
);
