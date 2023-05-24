import { useState } from 'react';

import './App.scss';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    const isMovieInMoviesArray
    = movies.some(prevMovie => prevMovie.imdbId === movie.imdbId);

    if (!isMovieInMoviesArray) {
      setMovies(prevState => ([
        ...prevState,
        movie,
      ]));
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={addMovie} />
      </div>
    </div>
  );
};
