import React, { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>(data);

  function addMovie(movieApi: Movie) {
    const repeatedMovie = movies.find(movie => movie.imdbId === movieApi.imdbId);

    if (!repeatedMovie) {
      setMovies([
        ...movies,
        movieApi,
      ]);
    }
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
