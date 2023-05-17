import { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAdd = (newMovie: Movie) => {
    setMovies(currentMovie => {
      const isAlreadyAdded = currentMovie.some(item => (
        item.imdbId === newMovie.imdbId
      ));

      if (!isAlreadyAdded) {
        return [...currentMovie, newMovie];
      }

      return currentMovie;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleAdd} />
      </div>
    </div>
  );
};
