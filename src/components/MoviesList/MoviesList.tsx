import React from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../react-app-env';

export const MoviesList: React.FC<{ movies: Movie[] }> = ({ movies }) => {
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
};
