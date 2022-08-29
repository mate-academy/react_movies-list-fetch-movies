import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movieToAdd: Movie) => {
    const isMovie = movies.find(movieToFind => {
      return movieToFind.imdbId === movieToAdd.imdbId;
    }) ? true : false;

    if (!isMovie) {
      setMovies(state => [...state, movieToAdd]);
    }
  }

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
