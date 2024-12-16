import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMoviesToTheList = (movie: Movie) => {
    setMovies(prevMovies => {
      const isAlreadyInList = prevMovies.some(
        existingMovie => existingMovie.imdbId === movie.imdbId,
      );

      if (isAlreadyInList) {
        return prevMovies;
      }

      return [...prevMovies, movie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={addMoviesToTheList} />
      </div>
    </div>
  );
};
