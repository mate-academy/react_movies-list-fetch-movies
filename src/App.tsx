import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const AddMovie = (addedMovie: Movie) => {
    setMovies(currentMovies => {
      const imdbIds = currentMovies.map(el => el.imdbId);

      if (!imdbIds.includes(addedMovie.imdbId)) {
        return [...currentMovies, addedMovie];
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
        <FindMovie AddMovie={AddMovie} />
      </div>
    </div>
  );
};
