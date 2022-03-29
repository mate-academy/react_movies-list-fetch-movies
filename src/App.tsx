import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieAdded, setMovieAdded] = useState<boolean>(false);

  const addMovie = (movie: Movie) => {
    if (movies.some(film => film.imdbID === movie.imdbID)) {
      setMovieAdded(true);
    } else {
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          setMovieAdded={setMovieAdded}
          movieAdded={movieAdded}
          onAddMovie={addMovie}
        />
      </div>
    </div>
  );
};
