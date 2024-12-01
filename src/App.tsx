import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAdd = (newMovie: Movie) => {
    for (const elem of movies) {
      if (elem.title === newMovie.title || elem.imdbUrl === newMovie.imdbUrl) {
        return;
      }
    }

    setMovies((prev: Movie[]) => [...prev, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={onAdd} />
      </div>
    </div>
  );
};
