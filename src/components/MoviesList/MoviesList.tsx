import React from 'react';

import './MoviesList.scss';
import { MemoMovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
};

export const MoviesList: React.FC<Props> = ({ movies }) => (
  <div className="movies">
    {movies.map(movie => (
      <MemoMovieCard key={movie.imdbId} movie={movie} />
    ))}
  </div>
);

export const MemoMoviesList = React.memo(MoviesList);
