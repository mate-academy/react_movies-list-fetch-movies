import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const MovieAdd = (movie: Movie): void => {
    const hasMovie = movies.every(({ imdbID }) => movie.imdbID !== imdbID);

    if (hasMovie === true) {
      setMovies(current => [movie, ...current]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onMovieAdd={MovieAdd} />
      </div>
    </div>
  );
};
