import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  // const movies: Movie[] = [];
  const [movies, newMovie] = useState<Movie[]>([]);

  /* const addMovie = (movie: Movie) => {
    movies.push(movie);
    // eslint-disable-next-line no-console
    console.log(movies);
  }; */

  const addMovie = (movie: Movie) => {
    if (movies.every(addedMovie => addedMovie.imdbID !== movie.imdbID)) {
      newMovie(addedMovies => [...addedMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie newMovie={addMovie} />
      </div>
    </div>
  );
};
