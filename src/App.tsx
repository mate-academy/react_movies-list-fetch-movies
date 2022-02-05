import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const updateMovies = (movie: Movie) => {
    const isMovieAdded = movies.find((m) => (m.imdbID === movie.imdbID));

    if (!isMovieAdded) {
      setMovies(
        [
          ...movies,
          movie,
        ],
      );
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>
      <div className="sidebar">
        <FindMovie updateMovies={updateMovies} />
      </div>
    </div>
  );
};
