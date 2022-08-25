import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addFoundMovieToList = useCallback((currentMovie: Movie) => {
    const isInMovieList = movies
      .some(movie => movie.imdbId === currentMovie.imdbId);

    if (!isInMovieList) {
      setMovies(currentMovies => [...currentMovies, currentMovie]);
    }
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={addFoundMovieToList} />
      </div>
    </div>
  );
};
