import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const isDuplicate = (foundMovie: Movie) => movies
    .map(movie => movie.imdbId)
    .includes(foundMovie.imdbId);

  const addMovie = (foundMovie: Movie) => {
    if (!isDuplicate(foundMovie)) {
      setMovies(addedeMovies => [...addedeMovies, foundMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onClick={addMovie} />
      </div>
    </div>
  );
};
