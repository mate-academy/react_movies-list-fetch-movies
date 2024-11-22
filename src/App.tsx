import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          value={inputValue}
          movies={movies}
          setValue={setInputValue}
          setMovies={setMovies}
        />
      </div>
    </div>
  );
};
