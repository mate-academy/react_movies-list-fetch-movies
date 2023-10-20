import React, { useContext } from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { MovieContext } from '../Context.tsx';

export const MoviesList: React.FC = React.memo(() => {
  const { movies } = useContext(MovieContext);

  return (
    <div className="movies">
      {movies && (
        movies.map(movie => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
          />
        ))
      )}
    </div>
  );
});
