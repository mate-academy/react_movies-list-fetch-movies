import React, { useState } from 'react';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import './App.scss';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hasAddError, setAddError] = useState(false);

  const addMovie = (movie: Movie) => {
    if (!movies.some(film => film.imdbID === movie.imdbID)) {
      setMovies(prev => [
        ...prev,
        movie,
      ]);
    } else {
      setAddError(true);
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
          hasAddError={hasAddError}
        />
      </div>
    </div>
  );
};
