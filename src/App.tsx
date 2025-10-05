import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddToList = (movie: Movie) => {
    setMovies(currMovies => {
      if (currMovies.some(currMovie => currMovie.imdbId === movie.imdbId)) {
        return currMovies;
      }

      return [...currMovies, movie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleAddToList} />
      </div>
    </div>
  );
};
