import React from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';

export const MoviesList = ({
  movies = [],
}) => (
  <div className="movies">
    {movies.map(movie => (
      <MovieCard key={movie.imdbId || movie.imdbID} {...movie} />
    ))}
  </div>
);
