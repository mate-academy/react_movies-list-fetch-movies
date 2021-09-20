import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

import './App.scss';

export const App: React.FC = () => {
  const [movies, setMovies] = useState(data);

  const addMovie = (movie: Movie) => {
    const moviesEqual = movies.find(oldMovie => oldMovie.imdbId === movie.imdbId);

    if (moviesEqual) {
      return;
    }

    setMovies((currentMovies) => [...currentMovies, movie]);
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
