import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import './App.scss';

export const App = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const addMovie = (foundMovie: Movie) => {
    const isMovieExists = movies
      .some(movie => movie.imdbId === foundMovie.imdbId);

    if (!isMovieExists) {
      setMovie(prevMovies => [...prevMovies, foundMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} />
      </div>
    </div>
  );
};
