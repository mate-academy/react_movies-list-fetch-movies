import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const addMovieInList = (move:Movie) => {
    if (movies.some(a => a.imdbId === move.imdbId)) {
      return;
    }

    setMovies([...movies, move]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovieInList={addMovieInList} />
      </div>
    </div>
  );
};
