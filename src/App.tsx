import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    const isRepeate = movies.find(item => item.title === movie.title);

    if (!isRepeate) {
      setMovies([...movies, movie]);
    } else {
      setMovies(movies);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMovies={addMovie} />
      </div>
    </div>
  );
};
