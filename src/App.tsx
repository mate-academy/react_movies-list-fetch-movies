import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovie] = useState([] as Movie[]);

  const addMovie = (movieFromServer: Movie) => {
    if (!movies.some(movie => movie.imdbID === movieFromServer.imdbID)) {
      setMovie([...movies, movieFromServer]);
    }
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
