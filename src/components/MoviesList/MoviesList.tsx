import React from 'react';

import './MoviesList.scss';
// import { useMovies } from '../../providers/MovieProvider';

export const MoviesList: React.FC = () => {
  // const { movies } = useMovies();

  return (
    <div className="movies">
      {/* {movies.map(movie => (
        <MovieCard
          key={movie.imdbId}
          movie={movie}
        />
      ))} */}
    </div>
  );
};
