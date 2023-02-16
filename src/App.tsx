import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const addMovies = (movie: Movie) => {
    if (movies.find((currentMovie => currentMovie.imdbId === movie.imdbId))) {
      return;
    }

    setMovies((currentMuvies) => [...currentMuvies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovies={addMovies} />
      </div>
    </div>
  );
};
