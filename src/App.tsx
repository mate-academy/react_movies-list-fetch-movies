import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handler = (movie: Movie | undefined) => {
    if (!movie) {
      return;
    }

    const found = [...movies].find((item) => item.imdbId === movie.imdbId);

    if (!found) {
      setMovies(allMovies => [...allMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie handler={handler} />
      </div>
    </div>
  );
};
