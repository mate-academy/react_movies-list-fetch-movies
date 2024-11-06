import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieAdd = (movieToFind: Movie) => {
    setMovies(prevMovies => {
      const isMovieInTheList = prevMovies.some(
        movie => movie.imdbId === movieToFind.imdbId,
      );

      if (!isMovieInTheList) {
        return [...prevMovies, movieToFind];
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
        <FindMovie handleMovieAdd={handleMovieAdd} />
      </div>
    </div>
  );
};
