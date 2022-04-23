import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesAlredyExist, setMoviesAlredyExist] = useState(false);

  const addMovie = (movie:Movie) => {
    if (movies.findIndex(el => movie.imdbID === el.imdbID) === -1) {
      setMovies([...movies, movie]);
    } else {
      setMoviesAlredyExist(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          moviesAlredyExist={moviesAlredyExist}
          setMoviesAlredyExist={setMoviesAlredyExist}
        />
      </div>
    </div>
  );
};
