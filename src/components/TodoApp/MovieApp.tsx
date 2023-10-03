import React, { useContext } from 'react';
import { MoviesList } from '../MoviesList';
import { FindMovie } from '../FindMovie';
import { MoviesContect } from '../../Context/MovieContext';

export const MovieApp: React.FC = () => {
  const { movies } = useContext(MoviesContect);

  return (
    <div className="page">
      <div className="page-content">
        {movies && <MoviesList movies={movies} />}
      </div>

      <div className="sidebar">
        <FindMovie />
      </div>
    </div>
  );
};
