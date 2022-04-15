import { useState } from 'react';
import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';
import './App.scss';

export function App() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    setMovies(prev => ([
      ...prev,
      newMovie,
    ]));
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} />
      </div>
    </div>
  );
}
