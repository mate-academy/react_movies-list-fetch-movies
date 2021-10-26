import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (newMovie: Movie) => {
    if (movies.find(movie => movie.imdbID === newMovie.imdbID)) {
      return;
    }

    setMovies(current => [newMovie, ...current]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie setMovies={handleAddMovie} />
      </div>
    </div>
  );
};
