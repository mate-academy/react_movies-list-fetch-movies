import React, { useState, useEffect } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieAlreadyExist, setMovieAlreadyExist] = useState(false);

  useEffect(() => {
    setMovies(data);
  }, []);

  const addMovie = (movie: Movie) => {
    const isAlreadyAdded = movies.some(({ imdbId }) => {
      return imdbId === movie.imdbId;
    });

    if (isAlreadyAdded) {
      setMovieAlreadyExist(true);

      return;
    }

    setMovieAlreadyExist(false);
    setMovies([...movies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          movieAlreadyExist={movieAlreadyExist}
        />
      </div>
    </div>
  );
};
