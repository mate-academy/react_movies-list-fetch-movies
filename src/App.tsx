import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    setMovies(curr => {
      const alreadyExist = curr.some(current => current.imdbID
        === movie.imdbID);

      if (alreadyExist) {
        return curr;
      }

      return [...curr, movie];
    });
  };

  const clearList = () => (
    setMovies([])
  );

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addMovie} onClear={clearList} />
      </div>
    </div>
  );
};
