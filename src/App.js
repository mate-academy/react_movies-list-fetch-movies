import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { getMovie } from './api/movies';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const [query, setQuery] = useState('');

  const changeQuery = (value) => {
    setQuery(value);
  };

  const findMovie = () => {
    const result = getMovie(encodeURI(query.toLowerCase()))
      .then(obj => ({ ...obj }));

    return result;
  };

  const addMovie = (movie) => {
    if (movies.find(item => item.imdbId === movie.imdbId)) {
      return false;
    }

    setMovies([...movies, movie]);

    return true;
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          query={query}
          setQuery={setQuery}
          changeQuery={changeQuery}
          findMovie={findMovie}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
