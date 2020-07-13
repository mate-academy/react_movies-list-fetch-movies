import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { MovieInterface } from '../Interfaces/Interface';

interface Props {
  movies: MovieInterface[];
}

export const MoviesList: React.FC<Props> = ({
  movies = [],
}) => (
  <div className="movies">
    {movies.map((movie) => (
      <MovieCard key={movie.imdbId} movie={movie} />
    ))}
  </div>
);
