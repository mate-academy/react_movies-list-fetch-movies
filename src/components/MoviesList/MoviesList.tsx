import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { useMovieState } from '../MovieProvider';

export const MoviesList: React.FC = () => {
  const { movies } = useMovieState();

  return (
    <div className="movies">
      {movies.map(movie => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
};
