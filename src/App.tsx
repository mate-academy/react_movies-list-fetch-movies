import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovies = (movie: Movie) =>
    movies.find(({ imdbId }) => imdbId === movie.imdbId)
      ? undefined
      : setMovies(state => [...state, movie]);

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
