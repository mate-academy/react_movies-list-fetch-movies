import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isDoubleFilm, setDoubleFilm] = useState<boolean>(false);

  const addMovie = useCallback((newMovie: Movie) => {
    const result = movies.some(movie => movie.imdbID === newMovie.imdbID);

    if (!result) {
      setMovies(prevMovies => [...prevMovies, newMovie]);
      setDoubleFilm(false);
    } else {
      setDoubleFilm(true);
    }
  }, [movies, isDoubleFilm]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onAddMovie={addMovie}
          doubleFilm={isDoubleFilm}
        />
      </div>
    </div>
  );
};
