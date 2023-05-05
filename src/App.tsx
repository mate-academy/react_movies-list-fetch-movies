import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieAdd = (movie: Movie) => {
    setMovies((prevMovies: Movie[]) => {
      const isMoviePresent = prevMovies.find(
        (currMovie) => currMovie.imdbId === movie.imdbId,
      );

      if (!isMoviePresent) {
        return [...prevMovies, movie];
      }

      return prevMovies;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMovieAdd={handleMovieAdd} />
      </div>
    </div>
  );
};
