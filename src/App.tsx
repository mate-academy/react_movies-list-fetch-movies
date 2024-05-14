import './App.scss';

import { useState } from 'react';
import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const handleMovie = (newMovie: Movie) => {
    if (movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      return;
    }

    {
      setMovie(prevState => [...prevState, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie handleMovie={handleMovie} />
      </div>
    </div>
  );
};
