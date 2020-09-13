import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [moviesList, refreshMoviesList] = useState(data);
  const [isMovieOnList, setMovieExistence] = useState(false);

  const addToMoviesList = (foundMovie) => {
    const isAlreadyOnList = moviesList.some(
      movie => movie.imdbId === foundMovie.imdbId,
    );

    if (isAlreadyOnList) {
      setMovieExistence(true);

      return;
    }

    refreshMoviesList([
      ...moviesList,
      foundMovie,
    ]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={moviesList} />
      </div>
      <div className="sidebar">
        <FindMovie
          addToList={addToMoviesList}
          isOnList={isMovieOnList}
          setExistence={setMovieExistence}
        />
      </div>
    </div>
  );
};
