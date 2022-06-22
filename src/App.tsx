import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const setMoviesFSState = (arrOfMovies: Movie[], addedMovie: Movie): void => {
    setMovies([...arrOfMovies, addedMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          setMoviesFSState={setMoviesFSState}
          movies={movies}
        />
      </div>
    </div>
  );
};
