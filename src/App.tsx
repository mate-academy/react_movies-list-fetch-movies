import { useState } from 'react';

import { Movie } from './types/Movie';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAddMovie = (movie: Movie) => {
    const isMovieInList = movies.some(mov => mov.imdbId === movie.imdbId);

    if (!isMovieInList) {
      setMovies(prev => [...prev, movie]);
    }
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
