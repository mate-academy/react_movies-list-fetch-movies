import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const uniqMovies = Array.from(new Set(movies));

  return (
    <div className="page">
      {movies && (
        <div className="page-content">
          <MoviesList movies={uniqMovies} />
        </div>
      )}

      <div className="sidebar">
        <FindMovie
          setMovies={setMovies}
        />
      </div>
    </div>
  );
};
