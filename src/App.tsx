import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC<{}> = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie): void => {
    const addedMovie = movies.every(({ imdbID }) => movie.imdbID !== imdbID);

    if (addedMovie) {
      setMovies(current => [...current, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie chooseMovie={addMovie} />
      </div>
    </div>
  );
};
