import React, { useState } from 'react';
import './App.scss';
import { FindMovie } from './components/FindMovie/FindMovie';
import { Movie } from './types/Movie';
import { MoviesList } from './components/MoviesList/MoviesList';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (newMovie: Movie) => {
    setMovies(prevMovies => [...prevMovies, newMovie]);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Find a movie:</h1>
        <div className="columns">
          <div className="column is-half">
            <MoviesList movies={movies} />
          </div>
          <div className="column is-half">
            <FindMovie onAddMovie={handleAddMovie} movies={movies} />
          </div>
        </div>
      </div>
    </div>
  );
};
