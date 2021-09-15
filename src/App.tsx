import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App: React.FC = () => {
  const [
    movies,
    setMovies,
  ] = useState(data);

  const addFoundMovie = (movieThatFound: Movie) => {
    if (!movies.some(({ imdbId }) => imdbId === movieThatFound.imdbId)) {
      setMovies([...movies, movieThatFound]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie handleAddFoundMovie={addFoundMovie} />
      </div>
    </div>
  );
};
