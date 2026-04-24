import React from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { MoviesContext } from '../MoviesContext';

export const MoviesList: React.FC = () => {
  const { movies } = React.useContext(MoviesContext)!;

  return (
    <div className="movies">
      {movies.map(movie => (
        <MovieCard key={movie.imdbId} movie={movie} />
      ))}
    </div>
  );
};
