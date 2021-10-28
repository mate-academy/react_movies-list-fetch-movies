import { FC, useState } from 'react';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import './App.scss';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const checkMovie = (newMovie: Movie) => {
    if (!movies.find(movie => movie.imdbID === newMovie.imdbID)) {
      setMovies([newMovie, ...movies]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={checkMovie} />
      </div>
    </div>
  );
};
