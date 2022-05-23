import React, { useState, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovieFromServer = useCallback((newMovie: Movie) => {
    if (!movies.some(movie => movie.imdbID === newMovie.imdbID)) {
      setMovies([...movies, newMovie]);
    } else {
      alert('Ooops...You already have this movie, enjoy!'); // eslint-disable-line
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        {movies && <MoviesList movies={movies} />}
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovieFromServer} />
      </div>
    </div>
  );
};
