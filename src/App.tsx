import { useCallback, useState } from 'react';
import './App.scss';
import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [errorAddExist, setErrorAddExist] = useState(false);

  const onAddMovie = useCallback((movie: Movie) => {
    setMovies(prev => {
      const isMovieExist = !prev.some(m => m.imdbId === movie.imdbId);

      if (movie && isMovieExist) {
        return [...prev, movie];
      }

      setErrorAddExist(prevError => !prevError);

      return prev;
    });
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>

      <div className="sidebar">
        <FindMovie
          setErrorAddExist={setErrorAddExist}
          onAddMovie={onAddMovie}
          errorAddMovie={errorAddExist}
        />
      </div>
    </div>
  );
};
