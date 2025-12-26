import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
///import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  //const addMovie = (newMovie: Movie) => {
  //setMovies((prevMovies: Movie[]) => [...prevMovies, newMovie]);
  // };
  const addMovie = (newMovie: Movie) => {
    setMovies(prevMovies => {
      const isAlreadyAdded = prevMovies.some(
        movie => movie.imdbId === newMovie.imdbId,
      );

      if (isAlreadyAdded) {
        return prevMovies;
      }

      return [...prevMovies, newMovie];
    });
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
