import React, { useContext } from 'react';
import { MoviesList } from '../MoviesList';
import { FindMovie } from '../FindMovie';
import { MovieContext } from '../../context/MovieContext';

export const MoviesApp: React.FC = () => {
  const { movies } = useContext(MovieContext);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie />
      </div>
    </div>
  );
};
