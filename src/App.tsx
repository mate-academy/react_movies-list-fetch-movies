import './App.scss';
import React, { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addToList: AddToList = (movie) => {
    if (movie) {
      if (!movies.find(item => item.imdbID === movie.imdbID)) {
        setMovies(prevMovie => [...prevMovie, movie]);
      }
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
