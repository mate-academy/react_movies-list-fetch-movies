import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onMovieAdd = (newMovie: Movie) => {
    let hasMovie = false;

    for (const movie of movies) {
      if (movie.imdbId === newMovie.imdbId) {
        hasMovie = true;
        break;
      }
    }

    if (!hasMovie) {
      setMovies(currentMovies => [...currentMovies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMovieAdd={onMovieAdd} />
      </div>
    </div>
  );
};
