import React, { memo } from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { useMoviesContext } from '../../customHooks/useMoviesContext';

export const MoviesList: React.FC = memo(() => {
  const { movies } = useMoviesContext();

  return (
    <div className="movies">
      {movies.map(movie => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </div>
  );
});
