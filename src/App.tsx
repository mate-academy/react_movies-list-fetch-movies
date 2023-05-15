import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (newMovie: Movie) => {
    if (newMovie) {
      setMovies(prevMovies => {
        return prevMovies
          .some(({ imdbId }) => imdbId === newMovie.imdbId)
          ? prevMovies
          : [...prevMovies, newMovie];
      });
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie handlerAdd={handleAddMovie} />
      </div>
    </div>
  );
};
