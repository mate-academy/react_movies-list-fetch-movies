import { useState } from 'react';
import './App.scss';

import { Movie } from './types/Movie';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (film: Movie) => {
    const alreadyAdded = movies.some(movie => movie.imdbId === film.imdbId);

    if (!alreadyAdded) {
      setMovies(currentList => [...currentList, film]);
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
