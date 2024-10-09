import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAddMovie = (addedMovie: Movie) => {
    setMovies(currMovies => {
      const imdbIds = currMovies.map(el => el.imdbId);

      if (!imdbIds.includes(addedMovie.imdbId)) {
        return [...currMovies, addedMovie];
      }

      return currMovies;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={onAddMovie} />
      </div>
    </div>
  );
};
