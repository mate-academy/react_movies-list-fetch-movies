import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovieList] = useState<Movie[]>([]);

  const addMovieToList = (movie: Movie) => {
    if (!movies.find(currentMovie => (currentMovie.imdbID === movie.imdbID))) {
      setMovieList([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovieToList={addMovieToList} />
      </div>
    </div>
  );
};
