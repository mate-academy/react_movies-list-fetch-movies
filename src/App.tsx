import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const getAddMovie = (newMovie: Movie) => {
    setMovie(cureentMovies => {
      if (cureentMovies.find(move => move.imdbId === newMovie.imdbId)) {
        return cureentMovies;
      }

      return [...cureentMovies, newMovie];
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
