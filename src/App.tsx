import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { MoviesCard } from './components/interfaces';

export const App: React.FC = () => {
  const [hasAlready, setHasAlreadyStatus] = useState(false);
  const [movies, setMovies] = useState(data);

  const isNotHasAlready = () => {
    setHasAlreadyStatus(false);
  };

  const addFilm = (film: MoviesCard) => {
    const isHasAlready = movies
      .some(movie => movie.imdbId === film.imdbId);

    if (!isHasAlready) {
      setMovies([...movies, film]);
    } else {
      setHasAlreadyStatus(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          hasAlready={hasAlready}
          addFilm={addFilm}
          isNotHasAlready={isNotHasAlready}
        />
      </div>
    </div>
  );
};
