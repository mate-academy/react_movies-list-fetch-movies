import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieAdd = (m: Movie) => {
    setMovies(prev => {
      if (prev.find(movie => movie.imdbId === m.imdbId)) {
        return prev;
      }

      return [...prev, m];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onMovieAdd={handleMovieAdd}
        />
      </div>
    </div>
  );
};
