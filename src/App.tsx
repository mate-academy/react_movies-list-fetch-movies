import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (newMovies: Movie) => {
    setMovies(currentMovies => {
      const alreadyAdded = currentMovies.some(
        movie => movie.imdbId === newMovies.imdbId
      );

      if (alreadyAdded) {
        return currentMovies;
      }

      return [...currentMovies, newMovies];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          savedMovies={movies}
          onAddMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
