/* eslint-disable no-alert */
import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback(async (movie: Movie) => {
    if (movie === null) {
      alert('Please, find the movie title first');
    } else if (movies.find(item => movie.imdbID === item.imdbID)) {
      alert('Movie already exists');
    } else {
      setMovies([...movies, movie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
