import { useCallback, useState } from 'react';
import './App.scss';
import { Movie } from './types/Movie';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((movie: Movie) => {
    if (!movies.some(item => item.imdbId === movie.imdbId)) {
      setMovies(prevState => [...prevState, movie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMovieAd={addMovie} />
      </div>
    </div>
  );
};
