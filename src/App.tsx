import { useState } from 'react';
import './App.scss';

import { Movie } from './types';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    const isDuplicate = movies.some(movie => movie.imdbId === newMovie.imdbId);

    if (!isDuplicate) {
      setMovies(currentMovies => [...currentMovies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={addMovie} />
      </div>
    </div>
  );
};
