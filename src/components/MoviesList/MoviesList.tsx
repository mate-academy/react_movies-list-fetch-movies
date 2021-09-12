import React from 'react';
import './MoviesList.scss';
import { Film } from '../../types/Film';
import { MovieCard } from '../MovieCard';

interface Props {
  movies: Film[];
}

export const MoviesList: React.FC<Props> = ({
  movies = [],
}) => (
  <div className="movies">
    {movies.map(movie => (
      <MovieCard key={movie.imdbId} {...movie} />
    ))}
  </div>
);
