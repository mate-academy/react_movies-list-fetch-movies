import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [requestMovie, setRequestMovie] = useState<Movie | null>(null);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          currentMovie={requestMovie}
          movies={movies}
          setMovie={setRequestMovie}
          setMovies={setMovies}
        />
      </div>
    </div>
  );
};
