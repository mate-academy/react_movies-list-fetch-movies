import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState('');

  const addMovie = (newMovie: Movie) => {
    if (movies.some(film => film.imdbId === newMovie.imdbId)) {
      setError('Movie is already in the list!');

      return;
    }

    setMovies(prevMovies => [...prevMovies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          error={error}
          setError={setError}
        />
      </div>
    </div>
  );
};
