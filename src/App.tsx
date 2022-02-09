import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, newMovie] = useState<Movie[]>([]);

  const addMovie = useCallback((movie: Movie) => {
    const isMovieAdded = movies.every(addedMovie => addedMovie.imdbID !== movie.imdbID);

    if (isMovieAdded) {
      newMovie([...movies, movie]);
    }
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie newMovie={addMovie} />
      </div>
    </div>
  );
};
