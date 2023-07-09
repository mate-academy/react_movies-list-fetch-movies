import { useState, useCallback } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAddMovieToList = useCallback((newMovie: Movie) => {
    setMovies(prevMovies => {
      if (prevMovies.some(movie => movie.imdbId === newMovie.imdbId)) {
        return prevMovies;
      }

      return [
        ...prevMovies,
        newMovie,
      ];
    });
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        {movies.length > 0 && (
          <MoviesList movies={movies} />
        )}
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={onAddMovieToList} />
      </div>
    </div>
  );
};
