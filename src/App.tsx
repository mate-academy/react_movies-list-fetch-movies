import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  // function adds movie if it doesn`t exist
  const addMovie = (movie: Movie) => {
    const movieIsHereYet = movies.some(existMovie => (
      existMovie.imdbID === movie.imdbID
    ));

    if (!movieIsHereYet) {
      setMovies(stateMovies => [...stateMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length > 0 && (
          <MoviesList movies={movies} />
        )}
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
