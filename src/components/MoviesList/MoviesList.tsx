import React, { useContext } from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { AppContext } from '../AppProvider';

export const MoviesList: React.FC = () => {
  const { movies } = useContext(AppContext);

  return (
    <div className="movies">
      {movies.map(movie => (
        <MovieCard
          key={movie.imdbId}
          movie={movie}
        />
      ))}
    </div>
  );
};
