import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const handleMovieAdd = (movie: Movie | null) => {
    if (movie && !movies.some(someMovie => someMovie.imdbId === movie.imdbId)) {
      setMovie(prev => [...prev, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMovieAdd={handleMovieAdd} />
      </div>
    </div>
  );
};
