import { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import { Movie } from './types/Movie';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAddMovie = (movie: Movie) => {
    setMovies(prev => {
      const uniqueMovies = new Set(prev.map(m => m.imdbId));

      if (!uniqueMovies.has(movie.imdbId)) {
        return [...prev, { ...movie }];
      }

      return prev;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={onAddMovie} />
      </div>
    </div>
  );
};
