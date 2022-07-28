import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAdd = (movie: Movie) => {
    const hasMovie = movies
      .find(movieFromList => movieFromList.imdbId
        === movie.imdbId);

    if (hasMovie) {
      return;
    }

    setMovies([movie, ...movies]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={onAdd} />
      </div>
    </div>
  );
};
