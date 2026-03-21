import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);

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
