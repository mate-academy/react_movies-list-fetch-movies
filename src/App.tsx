import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addToList = useCallback((addMovie: Movie) => {
    if (movies.every(movie => movie.imdbId !== addMovie.imdbId)) {
      setMovies(prevMovies => [...prevMovies, addMovie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addToList={addToList} />
      </div>
    </div>
  );
};
