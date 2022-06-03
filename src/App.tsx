import React, { useState, useCallback } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import './App.scss';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((newMovie: Movie) => {
    const filteredMovies = movies
      .some(movie => movie.imdbID === newMovie.imdbID);

    if (filteredMovies) {
      alert('This movie has already been added to the list');
    } else {
      setMovies([...movies, newMovie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
