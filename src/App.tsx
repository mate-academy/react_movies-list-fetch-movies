import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { Movie } from './types/Movie';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    if (movies.some(({ imdbId }) => imdbId === movie.imdbId)) {
      return;
    }

    setMovies((prev) => [...prev, movie]);
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
