import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addNewMovie = (newMovie: Movie) => {
    if (!newMovie
        || newMovie.Response === 'False') {
      return;
    }

    setMovies((prev) => {
      if (!movies.includes(newMovie)) {
        return [...prev, newMovie];
      }

      return prev;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addNewMovie}
        />
      </div>
    </div>
  );
};
