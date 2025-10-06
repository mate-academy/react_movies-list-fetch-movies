import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAdd = (movie: Movie) => {
    let added = false;

    setMovies(prev => {
      if (prev.some(m => m.imdbId === movie.imdbId)) {
        return prev;
      }

      added = true;

      return [...prev, movie];
    });

    return added;
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleAdd} />
      </div>
    </div>
  );
};
