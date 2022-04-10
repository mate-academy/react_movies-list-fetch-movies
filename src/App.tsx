import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const isMovieAlreadyAdded = (movie: Movie) => {
    if (!movies.some(item => item.imdbID === movie.imdbID)) {
      setMovies(moviesList => [...moviesList, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={isMovieAlreadyAdded} />
      </div>
    </div>
  );
};
