import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App:React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovie = (newMovie: Movie) => {
    if (movies.find(movie => movie.imdbID === newMovie.imdbID)) {
      return;
    }

    setMovies([newMovie, ...movies]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={handleMovie} />
      </div>
    </div>
  );
};
