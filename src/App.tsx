import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, toMoviesList] = useState<Movie[]>([]);

  const toAddMovie = (addMovie: Movie) => {
    if (movies.every(movie => movie.imdbID !== addMovie.imdbID)) {
      const newMovies = [...movies, addMovie];

      // eslint-disable-next-line no-console
      console.log('added movie to movielist', newMovies);

      toMoviesList(newMovies);
    } else {
      // eslint-disable-next-line no-console
      console.log('there is the same movie');
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          toAddMovie={toAddMovie}
        />
      </div>
    </div>
  );
};
