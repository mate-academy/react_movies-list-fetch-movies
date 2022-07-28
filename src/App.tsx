/* eslint-disable no-console */
import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    setMovie(allMovies => {
      return allMovies.some(movie => movie.imdbId === newMovie.imdbId)
        ? allMovies
        : [...allMovies, newMovie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie moveMovieToList={addMovie} />
      </div>
    </div>
  );
};
