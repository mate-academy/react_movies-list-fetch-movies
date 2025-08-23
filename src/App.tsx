import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleNewMovie = (movie: Movie) => {
    if (!movies.find(addedMovie => addedMovie.imdbId === movie.imdbId)) {
      setMovies(currentMovies => [...currentMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie handleNewMovie={handleNewMovie} />
      </div>
    </div>
  );
};
