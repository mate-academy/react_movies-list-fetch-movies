import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './react-app-env';

export function App() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    if (!movies.some(film => film.imdbID === movie.imdbID)) {
      setMovies((state) => ([...state, movie]));
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
}
