import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
};

export const MoviesList: React.FC<Props> = React.memo(({ movies }) => (
  <div className="movies">
    {movies.length === 0 ? (
      <div className="movies__empty">No movies yet</div>
    ) : (
      movies.map(m => <MovieCard key={m.imdbId} movie={m} />)
    )}
  </div>
));

MoviesList.displayName = 'MoviesList';
