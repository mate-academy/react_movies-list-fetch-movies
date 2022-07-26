import { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './react-app-env';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (film: Movie) => {
    setMovies((prevMovies) => {
      if (prevMovies.some(movie => movie.imdbID === film.imdbID)) {
        return prevMovies;
      }

      return [...prevMovies, film];
    });
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
