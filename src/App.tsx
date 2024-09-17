import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    const index = movies.findIndex(movie => newMovie.imdbId === movie.imdbId);

    if (index !== -1) {
      setMovies(currentMovies => [
        ...currentMovies.slice(0, index),
        ...currentMovies.slice(index + 1),
        newMovie,
      ]);
    } else {
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
