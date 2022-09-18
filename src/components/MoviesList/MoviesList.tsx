import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: MovieData[];
};

export const MoviesList: React.FC<Props> = ({ movies }) => (
  <div className="movies">
    {movies.map(movie => (
      <MovieCard
        key={movie.imdbID}
        movie={movie}
      />
    ))}
  </div>
);
