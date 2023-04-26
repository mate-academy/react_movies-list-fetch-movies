import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handlerMovie = (newMovie: Movie) => {
    setMovies((current) => {
      const isNewMovieSame = current.find(item => (
        item.imdbUrl === newMovie.imdbUrl
      ));

      if (!isNewMovieSame) {
        return [
          ...current,
          newMovie,
        ];
      }

      return current;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onFindMovieClick={handlerMovie} />
      </div>
    </div>
  );
};
