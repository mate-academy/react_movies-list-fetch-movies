import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App: React.FC = () => {
  const [movies, setMovies] = useState(data);

  const addNewMovie = (movie: Movie | null) => {
    if (movie && !movies.find(film => film.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addNewMovie} />
      </div>
    </div>
  );
};
