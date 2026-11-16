import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie | null) => {
    if (!newMovie) {
      return;
    }

    setMovies(prevMovies => {
      const alreadyAdded = prevMovies.some(
        movie => movie.imdbId === newMovie.imdbId,
      );

      return alreadyAdded ? prevMovies : [...prevMovies, newMovie];
    });
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
