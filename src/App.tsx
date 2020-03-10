import React, { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>(data);

  function addMovie(movie: Movie) {
    movies.find(item => item.imdbId === movie.imdbId);

    setMovies([
      ...movies,
      movie,
    ]);
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
