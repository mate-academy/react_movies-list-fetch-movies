import React, { useState, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMoives] = useState<Movie[]>([]);

  const addMovieFromAPI = useCallback((newMovie: Movie) => {
    if (!movies.some(movie => movie.imdbID === newMovie.imdbID)) {
      setMoives([...movies, newMovie]);
    } else {
      // eslint-disable-next-line no-alert
      alert('You have already added this movie to the list');
    }
  }, [movies]);

  return (
    <div className="page">
      Hello
      <div className="page-content">
        {movies && <MoviesList movies={movies} />}
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovieFromAPI} />
      </div>
    </div>
  );
};
