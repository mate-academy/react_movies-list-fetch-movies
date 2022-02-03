import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

type Props = {};

export const App: React.FC<Props> = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (film: Movie) => {
    if (!movies.some(movie => movie.imdbID === film.imdbID)
      && film.imdbID) {
      setMovies(prevMovies => [...prevMovies, film]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={handleAddMovie} movies={movies} />
      </div>
    </div>
  );
};
