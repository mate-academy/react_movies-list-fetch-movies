import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, addMovie] = useState<Movie[]>([]);

  const onAddMovie = useCallback((newMovie: Movie): void => {
    const moviesIds = movies.map(
      ({ imdbID }) => imdbID,
    );

    if (!moviesIds.includes(newMovie.imdbID)) {
      addMovie([newMovie, ...movies]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={onAddMovie} />
      </div>
    </div>
  );
};
