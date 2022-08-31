import { useCallback, useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((movieToAdd: Movie) => {
    const isMovie = movies.some(movieToFind => {
      return movieToFind.imdbId === movieToAdd.imdbId;
    });

    if (!isMovie) {
      setMovies(state => [...state, movieToAdd]);
    }
  }, movies);

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
