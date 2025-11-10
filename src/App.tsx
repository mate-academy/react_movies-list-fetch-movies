import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAdd = (movie: Movie) => {
    setMovies(curr =>
      curr.some(m => m.imdbId === movie.imdbId) ? curr : [...curr, movie],
    );
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleAdd} existing={movies} />
      </div>
    </div>
  );
};
