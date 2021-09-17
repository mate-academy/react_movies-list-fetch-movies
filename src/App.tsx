import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App: React.FC = () => {
  const [movies, setMovies] = useState(data);
  const [isMovie, setIsMovie] = useState(false);

  const getMovies = (movie: Movie) => {
    const checkMovie = movies.some(film => film.imdbID === movie.imdbID);

    if (!checkMovie) {
      setMovies([movie, ...movies]);
      setIsMovie(false);
    } else {
      setIsMovie(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie getMovies={getMovies} />

        {isMovie && (
          <h3>You have already added this movie</h3>
        )}
      </div>
    </div>
  );
};
