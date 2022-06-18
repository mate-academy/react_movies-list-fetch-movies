import { useState } from 'react';

import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>();

  const movieList = (newMovie: Movie) => {
    if (!movies?.includes(newMovie)) {
      setMovies((prev) => {
        return prev
          ? [...prev, newMovie]
          : [newMovie];
      });
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        {
          movies && <MoviesList movies={movies} />
        }
      </div>
      <div className="sidebar">
        <FindMovie movieList={movieList} />
      </div>
    </div>
  );
};
