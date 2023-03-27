import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovies = (movie: Movie) => {
    let count = false;

    for (let i = 0; i < movies.length; i += 1) {
      if (movies[i].imdbId === movie.imdbId) {
        count = true;
      }
    }

    if (!count) {
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie setMovies={addMovies} />
      </div>
    </div>
  );
};
