import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const isMovieExists = useCallback((movie: Movie) => {
    return movies.some(film => film.imdbId === movie.imdbId);
  }, [movies]);

  const onAdd = (movie: Movie) => {
    setMovies([...movies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAdd={onAdd}
          isMovieExists={isMovieExists}
        />
      </div>
    </div>
  );
};
