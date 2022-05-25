import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import './App.scss';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Array<Movie>>([]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          setMovies={setMovies}
        />
      </div>
    </div>
  );
};
