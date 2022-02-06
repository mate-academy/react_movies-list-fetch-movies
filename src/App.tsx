import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovieToList: AddMovieToList = (findedMovie) => {
    if (findedMovie) {
      if (!movies.some(movie => movie.imdbID === findedMovie.imdbID)) {
        setMovies(prevMovies => [...prevMovies, findedMovie]);
      }
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovieToList={addMovieToList}
        />
      </div>
    </div>
  );
};
