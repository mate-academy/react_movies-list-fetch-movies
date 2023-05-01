import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAddMovie = (movie: Movie) => {
    const hasMovie = movies.find(item => item.imdbId === movie.imdbId);

    if (!hasMovie) {
      setMovies((prev) => {
        return [...prev, movie];
      });
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie handleMovieAdd={onAddMovie} />
      </div>
    </div>
  );
};
