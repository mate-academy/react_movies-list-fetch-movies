import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [queryInput, setQueryInput] = useState('');
  const [addedMovies, setAddedMovies] = useState<Movie[]>([]);

  const handleAddMovie = (newMovie: Movie) => {
    if (!newMovie.Title) {
      return;
    }

    setAddedMovies([...addedMovies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={addedMovies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movies={addedMovies}
          onMovieAdd={handleAddMovie}
          queryInput={queryInput}
          setQueryInput={setQueryInput}
        />
      </div>
    </div>
  );
};
