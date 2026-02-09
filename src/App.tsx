import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (movie: Movie) => {
    setMovies(prev => {
      if (!prev.some(movieItem => movieItem.imdbId === movie.imdbId)) {
        return [...prev, movie];
      }

      return prev;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMovieAdd={handleAddMovie} />
      </div>
    </div>
  );
};
