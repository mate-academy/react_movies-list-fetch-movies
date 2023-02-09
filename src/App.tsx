import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const addMovie = (finded: Movie) => {
    const isRepited = movies.some(movie => movie.imdbId === finded.imdbId);

    if (!isRepited) {
      setMovie(curr => [...curr, finded]);
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
