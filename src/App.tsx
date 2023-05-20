import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAdd = (newMovie: Movie) => {
    setMovies(movie => {
      const isAdded = movie.some(item => (
        item.imdbId === newMovie.imdbId
      ));

      if (!isAdded) {
        return [...movie, newMovie];
      }

      return movie;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={handleAdd} />
      </div>
    </div>
  );
};
