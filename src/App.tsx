import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<(MovieData | null)[]>([]);

  const addMovie = (movie: MovieData | null) => {
    setMovies((prevState) => {
      if (prevState.find(addedMovie => addedMovie?.imdbID === movie?.imdbID)) {
        return prevState;
      }

      return [...prevState, movie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
