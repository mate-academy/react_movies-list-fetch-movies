import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, updateList] = useState([...data]);
  const [isNotInTheList, switchNoInTheList] = useState(false);

  const addMovieToList = (preview) => {
    if (isNotInTheList) {
      updateList([...movies, preview]);
      switchNoInTheList(false);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          movies={movies}
          switchNoInTheList={switchNoInTheList}
          isNotInTheList={isNotInTheList}
          addMovieToList={addMovieToList}
        />
      </div>
    </div>
  );
};
