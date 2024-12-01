import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (moviePrewiew: Movie) => {
    if (!movies.some((movie) => movie.imdbId === moviePrewiew.imdbId)) {
      setMovies((currentMovies) => [...currentMovies, moviePrewiew]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={(movie: Movie) => addMovie(movie)} />
      </div>
    </div>
  );
};
