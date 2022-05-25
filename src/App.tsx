import React, { useState, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[] | []>([]);

  const addMovie = useCallback((movie: Movie) => {
    setMovies([...movies, movie]);
  }, [movies]);

  const movieInTheList = useCallback((movie: Movie) => {
    return movies.some(el => el.imdbID === movie.imdbID);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          movieInTheList={movieInTheList}
        />
      </div>
    </div>
  );
};
