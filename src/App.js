import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const [sameMovie, setSameMovie] = useState(false);
  const [noMovie, setNoMovie] = useState(false);

  const addNewMovie = (newMovie) => {
    if (movies.find(movie => movie.imdbId === newMovie.imdbId)) {
      setSameMovie(true);

      return;
    }

    if (!newMovie.imdbId) {
      setNoMovie(true);

      return;
    }

    setSameMovie(false);
    setNoMovie(false);
    setMovies(prevMoviesList => [newMovie, ...prevMoviesList]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onAdd={addNewMovie}
          setNoMovie={setNoMovie}
          setSameMovie={setSameMovie}
          sameMovie={sameMovie}
          noMovie={noMovie}
        />
      </div>
    </div>
  );
};
