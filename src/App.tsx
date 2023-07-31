import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    if (movies.length > 0) {
      if (movies.findIndex(
        movie => movie.imdbId === newMovie.imdbId,
      ) !== -1) {
        return;
      }
    }

    setMovies(currentList => [
      ...currentList,
      newMovie,
    ]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAdd={addMovie}
        />
      </div>
    </div>
  );
};
