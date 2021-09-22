import React from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import moviesFromServer from './api/movies.json';

export const App:React.FC = () => {
  const [movies, setMovies] = React.useState([...moviesFromServer]);

  const addMovie = (newMovie: Movie | null) => {
    if (!newMovie) {
      return;
    }

    if (movies.includes(newMovie) || !newMovie) {
      return;
    }

    setMovies([newMovie, ...movies]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
