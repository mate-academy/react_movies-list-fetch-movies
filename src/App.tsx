import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[] | []>([]);
  const [isAddedMovie, setIsAddedMovie] = useState(false);

  const addMovie = (newFilm: Movie) => {
    if (movies.every(movie => movie.imdbID !== newFilm.imdbID)) {
      setMovies((prev) => [...prev, newFilm]);
      setIsAddedMovie(false);
    } else {
      setIsAddedMovie(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
        {isAddedMovie && (
          <p className="help is-danger">
            Such a movie has been already added
          </p>
        )}
      </div>
    </div>
  );
};
