import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {

    setMovies(prev => {
      const filteredMovies = prev.filter(i => i.imdbID !== movie.imdbID);

      return [...filteredMovies, movie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addMovie} />
      </div>
    </div>
  );
};

export default App;
