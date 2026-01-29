import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    setMovies(prevMovies => {
      if (prevMovies.find(m => m.imdbId === movie.imdbId)) {
        return prevMovies;
      } else {
        return [...prevMovies, movie];
      }
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie setMovies={addMovie} />
      </div>
    </div>
  );
};
