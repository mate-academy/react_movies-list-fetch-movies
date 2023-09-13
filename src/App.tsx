import './App.scss';
import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSetMovies = (e: Movie) => {
    if (movies) {
      if (movies.find(movie => movie.imdbId === e.imdbId)) {
        return;
      }
    }

    setMovies([...movies, e]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />

      </div>

      <div className="sidebar">
        <FindMovie
          handleSetMovies={handleSetMovies}
        />
      </div>
    </div>
  );
};
