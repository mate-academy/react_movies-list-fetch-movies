import { FC, useRef, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const addedFilmsId = useRef<string[]>([]);

  const addMovie = (newMovie: Movie) => () => {
    if (newMovie && !addedFilmsId.current.includes(newMovie.imdbID)) {
      setMovies((state) => [...state, newMovie]);
      addedFilmsId.current = [...addedFilmsId.current, newMovie.imdbID];
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addMovie} />
      </div>
    </div>
  );
}
