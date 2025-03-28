// import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { useLocalStorage } from './hooks/useLocalStorage';

export const App = () => {
  // const [movies, setMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useLocalStorage<Movie[]>('movieList', []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie movieList={movies} onMovies={setMovies} />
      </div>
    </div>
  );
};
