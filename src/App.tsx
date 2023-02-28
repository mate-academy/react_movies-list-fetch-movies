import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { ErrorMessage } from './types/ErrorMessage';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [
    errorMessage, setErrorMessage,
  ] = useState<ErrorMessage>(ErrorMessage.NONE);

  const changeErrorMessage = useCallback(
    (message: ErrorMessage) => setErrorMessage(message), [],
  );

  const addMovie = useCallback((movie: Movie) => {
    const hasMovie = movies.some(m => m.imdbId === movie.imdbId);

    if (!hasMovie) {
      setMovies((currentMovies) => [...currentMovies, movie]);
    } else {
      setErrorMessage(ErrorMessage.HASMOVIE);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          errorMessage={errorMessage}
          changeErrorMessage={changeErrorMessage}
        />
      </div>
    </div>
  );
};
