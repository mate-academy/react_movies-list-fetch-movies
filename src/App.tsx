import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  function addToTheList(movie: Movie) {
    setMovies(prev => {
      const alreadyAdded = prev.some(mov => mov.imdbId === movie.imdbId);

      if (alreadyAdded) {
        return prev;
      }

      return [...prev, movie];
    });
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addToTheList={addToTheList} />
      </div>
    </div>
  );
};
