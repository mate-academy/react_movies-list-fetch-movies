import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
};

export const MoviesList: React.FC<Props> = ({ movies }) => (
  <div className="movies">
    {movies &&
      movies.map(movie => {
        return <MovieCard key={movie.imdbId} movie={movie} />;
      })}
  </div>
);
