import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie | null) => {
    const isMovieInList = movies.some(filterMovie => (
      filterMovie.imdbID === movie?.imdbID
    ));

    if (!movie || isMovieInList) {
      return;
    }

    setMovies(moviesList => [...moviesList, movie]);
  };

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
