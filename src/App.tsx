import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);

  const addNewMovie = (newMovie: MovieData | null) => {
    if (newMovie === null) {
      return;
    }

    const isMovieAlreadyExist = movies.find(
      addedMovie => addedMovie.imdbID === newMovie.imdbID,
    );

    if (!isMovieAlreadyExist) {
      setMovies([...movies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addNewMovie={addNewMovie} />
      </div>
    </div>
  );
};
