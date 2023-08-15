import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAdding = (movie: Movie): void => {
    const isMovieAded = movies.some(({ imdbId }) => imdbId === movie.imdbId);

    if (isMovieAded) {
      return;
    }

    setMovies((prew) => [...prew, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          setMovies={handleAdding}
        />
      </div>
    </div>
  );
};
