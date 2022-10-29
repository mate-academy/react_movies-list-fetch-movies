import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (mov: Movie): void => {
    const result = !movies.find(movie => movie.imdbId === mov.imdbUrl);
    const isDuplicated = movies.find(movie => movie.imdbId === mov.imdbId);

    if (result && !isDuplicated) {
      setMovies([...movies, mov]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
