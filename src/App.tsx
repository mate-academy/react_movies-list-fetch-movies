import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSetMovies = (movie: Movie) => {
    const checkMovie = movies.find((m) => m.imdbId === movie.imdbId);

    if (!checkMovie) {
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie setMovies={handleSetMovies} />
      </div>
    </div>
  );
};
