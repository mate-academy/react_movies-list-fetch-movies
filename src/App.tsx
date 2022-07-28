import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addFindedMovie = (findedMovie: Movie) => {
    if (movies.some(movie => movie.imdbId === findedMovie.imdbId)) {
      return;
    }

    setMovies([...movies, findedMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addFindedMovie={addFindedMovie}
        />
      </div>
    </div>
  );
};
