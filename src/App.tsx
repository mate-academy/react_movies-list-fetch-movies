import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const movieSaver = (movie: Movie) => {
    const imbdID = movies.map(item => item.imdbID);

    if (!imbdID.includes(movie.imdbID)) {
      setMovies(current => [...current, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie movieSaver={movieSaver} />
      </div>
    </div>
  );
};
