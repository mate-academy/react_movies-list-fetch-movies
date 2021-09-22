import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App:React.FC = () => {
  const [movies, setMovies] = useState([...data.map((movie) => ({
    Poster: movie.imgUrl,
    Title: movie.title,
    Plot: movie.description,
    imdbID: movie.imdbId,
  }))]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie setMovies={setMovies} movies={movies} />
      </div>
    </div>
  );
};
