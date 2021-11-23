import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const isMovieInList = (movie: Movie) => {
    return movies.find(film => film.imdbID === movie.imdbID);
  };

  const addMovies = (movie: Movie) => {
    if (!isMovieInList(movie)) {
      setMovies(previousMovies => [...previousMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addNewMovie={addMovies} />
      </div>
    </div>
  );
};
