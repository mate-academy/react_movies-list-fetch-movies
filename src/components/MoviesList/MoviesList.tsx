import React, { useContext } from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { MovieContext } from '../moviecontext/moviecontext';

export const MoviesList: React.FC = () => {
  const context = useContext(MovieContext);

  if (!context) {
    return null;
  }

  const { movielist } = context;

  return (
    <div className="movies">
      {movielist.map(movie => (
        <MovieCard key={movie.imdbId} movie={movie} />
      ))}
    </div>
  );
};
