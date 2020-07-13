import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { MovieInterface } from './components/Interfaces/Interface';

export const App: React.FC = () => {
  const [movies, setMovies] = useState(data);

  const addMovieToTheList = (movie: MovieInterface) => {
    const isExists = movies.find(film => film.imdbId === movie.imdbId);

    if (!isExists) {
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
          addMovie={addMovieToTheList}
        />
      </div>
    </div>
  );
};
