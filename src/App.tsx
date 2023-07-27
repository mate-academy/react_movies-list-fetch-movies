import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handlerAddMovie = (movie: Movie | null) => {
    setMovies((currentMovies) => {
      if (movie && !currentMovies.some(m => m.imdbId === movie.imdbId)) {
        return [...currentMovies, movie];
      }

      return currentMovies;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAddMovie={handlerAddMovie}
        />
      </div>
    </div>
  );
};
