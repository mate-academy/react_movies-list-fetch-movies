import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovie] = useState(data);
  const [addErrorMessage, getAddError] = useState(true);
  const addMovie = (movie) => {
    if (!movies.find(item => item.imdbId === movie.imdbId)) {
      setMovie([...movies, movie]);
    } else {
      getAddError(false);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          getAddError={getAddError}
          addErrorMessage={addErrorMessage}
        />
      </div>
    </div>
  );
};
