import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState([] as Movie[]);

  const addMovie = (movie: Movie) => {
    const isItNew = !movies.find(item => item.imdbID === movie.imdbID);

    if (isItNew) {
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addNewMovie={addMovie} />
      </div>
    </div>
  );
};
