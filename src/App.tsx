import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    if (!movies.some(item => item.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        {!!movies.length && <MoviesList movies={movies} />}
      </div>

      <div className="sidebar">
        <FindMovie addMovie={(movie:Movie) => addMovie(movie)} />
      </div>
    </div>
  );
};
