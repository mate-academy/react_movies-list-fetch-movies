import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { useLocalStorage } from './useLocalStorage';

export const App = () => {
  const [duplicate, setDuplicate] = useState(false);
  const [storedTheme, setTheme] = useLocalStorage('value', [...data]);

  const findId = (prevMovie, movie) => prevMovie
    .every(item => item.imdbID !== movie.imdbID) && movie.imdbID;

  const addNewMovie = (movie) => {
    setTheme((prevMovie) => {
      if (findId(prevMovie, movie)) {
        return [...prevMovie, movie];
      }

      setDuplicate(true);

      return prevMovie;
    });
  };

  const deleteDuplicateMessage = () => {
    setDuplicate(false);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={storedTheme} />
      </div>
      <div className="sidebar">
        <FindMovie
          addNewMovie={addNewMovie}
          duplicate={duplicate}
          deleteDuplicateMessage={deleteDuplicateMessage}
        />
      </div>
    </div>
  );
};
