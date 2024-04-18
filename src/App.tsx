import './App.scss';

import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MoviesList } from './components/MoviesList';
import { getMovie } from './api';
import { useState } from 'react';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  function handleFindMovie(query: string) {
    return getMovie(query);
  }

  function handleAddMovie(newMovie: Movie) {
    setMovies(prevMovies =>
      prevMovies.some(prevMovie => prevMovie.imdbId === newMovie.imdbId)
        ? prevMovies
        : [...prevMovies, newMovie],
    );
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          handleFindMovie={handleFindMovie}
          handleAddMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
