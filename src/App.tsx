import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addToList = (item: Movie) => {
    if (!movies.some(existingMovie => existingMovie.imdbId === item.imdbId)) {
      setMovies(prev => [...prev, item]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addToList={addToList} />
      </div>
    </div>
  );
};
