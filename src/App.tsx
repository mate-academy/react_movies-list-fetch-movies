import { useState } from 'react';
import './App.scss';
import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';
import { Movie } from './types/Movie';

export const App = () => {
  // const [array, setArray] = useState<MovieData | ResponseError>();
  const [movies, setMovie] = useState<Movie[]>([]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>

      <div className="sidebar">
        <FindMovie
          onAddMovie={setMovie}
        />
      </div>
    </div>
  );
};
