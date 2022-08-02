import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const newMovies = (newMovie: Movie) => {
    const hasMovie = movies.some(movie => movie.imdbId === newMovie.imdbId);

    if (!hasMovie) {
      setMovies([...movies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie newMovies={newMovies} />
      </div>
    </div>
  );
};
