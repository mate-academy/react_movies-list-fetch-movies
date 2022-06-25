import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [doubleAddError, setDoubleAddError] = useState(false);

  const addMovie = (movie: Movie): void => {
    const dublMovie = movies
      .some(currentMovie => currentMovie.imdbID === movie.imdbID);

    if (!dublMovie) {
      setMovies([
        ...movies,
        movie,
      ]);
      setDoubleAddError(false);
    } else {
      setDoubleAddError(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          doubleAddError={doubleAddError}
        />
      </div>
    </div>
  );
};
