import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const getAddMovie = (newMovie: Movie) => {
    setMovies(currentMovies => {
      if (currentMovies.find(m => m.imdbId === newMovie.imdbId)) {
        return currentMovies;
      }

      return [...currentMovies, newMovie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie getAddMovie={getAddMovie} />
      </div>
    </div>
  );
};
