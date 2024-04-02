import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (m: Movie) => {
    const newMovie = !movies.some(movie => movie.imdbId === m.imdbId);

    if (newMovie) {
      setMovies([...movies, m]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie setMovies={handleAddMovie} />
      </div>
    </div>
  );
};
