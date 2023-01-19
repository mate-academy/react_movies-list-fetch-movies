import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAdd = (movie: Movie) => {
    setMovies((prevMovies) => {
      if (!movie) {
        return prevMovies;
      }

      const movieToAdd = {
        ...movie,
      };

      const isMovieAdded = prevMovies.some((film => (
        film.imdbId === movie.imdbId
      )));

      if (isMovieAdded) {
        alert('the movie is already in your list');

        return prevMovies;
      }

      return [
        ...prevMovies,
        movieToAdd,
      ];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={onAdd} />
      </div>
    </div>
  );
};
