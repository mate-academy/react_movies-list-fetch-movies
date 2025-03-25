import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSetMovies = (newMovie: Movie) => {
    if (!movies.find(movie => movie.imdbId === newMovie.imdbId)) {
      setMovies(prev => [...prev, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={handleSetMovies} />
      </div>
    </div>
  );
};
