import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addFilm = (movie) => {
    if (movies.some(cinema => cinema.imdbId === movie.imdbID) === true) {
      return;
    }

    const { Title, Plot, Poster, imdbID } = movie;
    const result = {
      title: Title,
      description: Plot,
      imgUrl: Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };

    setMovies(array => [...array, result]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>
      <div className="sidebar">
        <FindMovie
          addFilm={addFilm}
        />
      </div>
    </div>
  );
};
