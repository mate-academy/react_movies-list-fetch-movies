import { useState } from 'react';
import './App.scss';
import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieAdd = (newMovie: Movie) => {
    setMovies(prev => {
      if (prev.find(({ imdbId }) => imdbId === newMovie.imdbId)) {
        return prev;
      }

      return [...prev, newMovie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMovieAdd={handleMovieAdd} />
      </div>
    </div>
  );
};
