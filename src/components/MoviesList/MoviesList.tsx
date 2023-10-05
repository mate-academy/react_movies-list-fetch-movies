import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { useMovies } from '../../contexts/MoviesContext';

export const MoviesList: React.FC = () => {
  const [movies] = useMovies();

  return (
    <div className="movies">
      {movies.map(movie => (
        <MovieCard
          key={movie.imdbId}
          movie={movie}
        />
      ))}
    </div>
  );
};
