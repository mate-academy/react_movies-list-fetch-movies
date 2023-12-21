import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovie, setCurrentMovie] = useState<string | null>('');

  const addMovie = (newMovie: Movie) => {
    if (newMovie.imdbId !== currentMovie) {
      setMovies([
        ...movies,
        newMovie,
      ]);

      setCurrentMovie(newMovie.imdbId);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onClick={addMovie}
        />
      </div>
    </div>
  );
};
