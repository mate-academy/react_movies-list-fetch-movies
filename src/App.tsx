import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App: React.FC = () => {
  const [movies, setMovie] = useState(data);

  const addMovie = (movie: Movie) => {
    if (!movies.find(m => m.imdbId === movie.imdbId)) {
      setMovie([movie, ...movies]);
    }
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
