import { useState } from 'react';
import './App.scss';

import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);

  const addMovieToList = (movie: MovieData) => {
    setMovies(prevList => [...prevList, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovieToList={addMovieToList} movies={movies} />
      </div>
    </div>
  );
};
