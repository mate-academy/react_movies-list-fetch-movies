import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

//new node v
export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    if (!movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      setMovies([...movies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onSubmit={addMovie} />
      </div>
    </div>
  );
};
