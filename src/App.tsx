import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './react-app-env';

import './App.scss';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[] | []>([]);

  const onMoviesChange = (movie: Movie) => {
    if (!movies.some(item => item.imdbID === movie.imdbID)) {
      setMovies(state => [...state, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={onMoviesChange} />
      </div>
    </div>
  );
};
