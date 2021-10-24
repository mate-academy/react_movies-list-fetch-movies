import React from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard/MovieCard';

interface Props {
  movies: MovieApi[];
}

export const MoviesList: React.FC<Props> = ({ movies }) => (
  <div className="movies">
    {movies.map(movie => (
      <MovieCard
        key={movie.imdbId}
        movie={movie}
      />
    ))}
  </div>
);
