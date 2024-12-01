import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = useCallback(
    (newMovie: Movie) => {
      const result = movies.find(movie => movie.imdbId === newMovie.imdbId);

      if (movies.length === 0 || !result) {
        setMovies(prevState => [...prevState, newMovie]);
      }
    },
    [movies],
  );

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
