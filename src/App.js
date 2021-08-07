import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

const moviesKey = 'movies';

export function App() {
  const moviesFromStorage = JSON.parse(window.localStorage.getItem(moviesKey));
  const [movies, setMovies] = useState(moviesFromStorage || data);

  const addMovieToList = (movie) => {
    const newMovie = {
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
      imdbId: movie.imdbID,
    };
    const stringifiedMovies = JSON.stringify([...movies, newMovie]);

    setMovies([...movies, newMovie]);
    window.localStorage.setItem(moviesKey, stringifiedMovies);
  };

  const checkMovie = imdbId => movies.some(movie => movie.imdbId === imdbId);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovieToList={addMovieToList}
          checkMovie={checkMovie}
        />
      </div>
    </div>
  );
}
