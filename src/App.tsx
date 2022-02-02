import React, { useState, useMemo } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useMemo(() => {
    return (Movie: Movie) => {
      setMovies(currentMovies => {
        if (currentMovies.some((movie: Movie) => movie.imdbID === Movie.imdbID)) {
          return currentMovies;
        }

        currentMovies.push(Movie);

        return currentMovies;
      });
    };
  }, []);

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
