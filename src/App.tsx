import { memo, useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = memo(() => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((movie: Movie) => {
    const isNewMovie = movies.every(film => (
      film.imdbId !== movie.imdbId
    ));

    if (isNewMovie) {
      setMovies(prevMovies => [...prevMovies, movie]);
    }
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onSetMovie={addMovie} />
      </div>
    </div>
  );
});
