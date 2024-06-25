import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    setMovies(currentMovies =>
      currentMovies.find(
        currentMovie => currentMovie.imdbId === newMovie.imdbId,
      )
        ? currentMovies
        : [...currentMovies, newMovie],
    );
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie AddMovie={addMovie} />
      </div>
    </div>
  );
};
