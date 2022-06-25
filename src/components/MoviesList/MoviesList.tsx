import React from 'react';
import { MovieCard } from '../MovieCard';

import { Movie } from '../../react-app-env';
import './MoviesList.scss';

interface Props {
  movies: Movie[];
}

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
