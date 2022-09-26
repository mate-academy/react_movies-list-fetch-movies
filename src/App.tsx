import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMove = (mov: Movie): void => {
    const res = !movies.find(movie => movie.imdbId === mov.imdbId);

    if (res) {
      setMovies([...movies, mov]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMove={addMove} />
      </div>
    </div>
  );
};
