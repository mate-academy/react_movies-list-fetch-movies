import './App.scss';
import React, { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC<{}> = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie | null) => {
    if (movie && !movies.some(film => movie.imdbID === film.imdbID)) {
      setMovies(prevMovies => [
        ...prevMovies,
        movie,
      ]);
    }
  };

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
