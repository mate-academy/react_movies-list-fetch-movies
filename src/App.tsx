import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [addedMovies, setAddedMovies] = useState<Movie[]>([]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={addedMovies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={setAddedMovies} />
      </div>
    </div>
  );
};
