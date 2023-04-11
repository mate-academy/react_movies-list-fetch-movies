import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    const hasMovie = movies.some(film => film.imdbId === movie.imdbId);

    if (!hasMovie) {
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
