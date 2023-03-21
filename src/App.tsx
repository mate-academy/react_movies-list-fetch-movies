import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const pushMovie = (movie: Movie) => {
    if (movies.length > 0) {
      const isMoviePresent = movies
        .some((elem) => elem.imdbId === movie.imdbId);

      return (isMoviePresent
        ? null
        : setMovies((item) => [...item, movie])
      );
    }

    return setMovies((item) => [...item, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovies={pushMovie} />
      </div>
    </div>
  );
};
