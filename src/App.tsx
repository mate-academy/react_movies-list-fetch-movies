import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovies = (currentMovie: Movie) => {
    if (movies.find(movie => movie.imdbId === currentMovie.imdbId)) {
      return;
    } else {
      setMovies(currentMovies => [...currentMovies, currentMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={handleMovies} />
      </div>
    </div>
  );
};
