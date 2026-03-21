import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { NormalizedMovie } from './types/NormalizedMovie';

export const App = () => {
  const [movies, setMovies] = useState<NormalizedMovie[]>([]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie movies={movies} onMovieAdd={setMovies} />
      </div>
    </div>
  );
};
