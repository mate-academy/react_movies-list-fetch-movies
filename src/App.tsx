import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = React.memo(() => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((movieForAdd: Movie) => {
    if (movies.some(movie => movie.imdbID === movieForAdd.imdbID)) {
      return;
    }

    setMovies([...movies, movieForAdd]);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} />
      </div>
    </div>
  );
});
