import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieAdd = (findMovie: Movie) => {
    if (movies.find(movie => movie.imdbId === findMovie?.imdbId)) {
      return;
    }

    setMovies(prev => [...prev, findMovie]);
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
