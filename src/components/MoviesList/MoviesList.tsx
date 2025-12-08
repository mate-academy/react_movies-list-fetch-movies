import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { MovieContext } from '../../context/movieContext';

export const MoviesList: React.FC = () => {
  const { movies } = React.useContext(MovieContext);

  return (
    <div className="movies">
      {movies.map(movie => (
        <MovieCard key={movie.imdbId} movie={movie} />
      ))}
    </div>
  );
};
