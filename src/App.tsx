import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onMovieAdd = (movie: Movie) => {
    const hasThisMovie = movies
      .some(someMovie => movie.imdbId === someMovie.imdbId);

    if (hasThisMovie) {
      return;
    }

    setMovies(prev => [
      ...prev,
      movie,
    ]);
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
