import { useState } from 'react';
import { Movie } from './types/Movie';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (movie: Movie) => {
    const isNewMovie = movies
      .some(curMovie => curMovie.imdbId === movie.imdbId);

    if (!isNewMovie) {
      setMovies(currMovies => [...currMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
