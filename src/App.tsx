import { useState } from 'react';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import { Movie } from './types/Movie';

import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieAdd = (movie: Movie) => {
    setMovies([...movies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>

      <div className="sidebar">
        <FindMovie
          movies={movies}
          onMovieAdd={handleMovieAdd}
        />
      </div>
    </div>
  );
};
