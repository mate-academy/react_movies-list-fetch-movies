import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
// import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  function handleAddMovies(value: Movie) {
    const result = movies.some(movie => movie.imdbId === value.imdbId);

    if (result) {
      return;
    }

    setMovies([...movies, value]);
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie handleAddMovies={handleAddMovies} />
      </div>
    </div>
  );
};
