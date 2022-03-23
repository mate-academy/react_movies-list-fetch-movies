import './App.scss';
import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { movieFromServer } from './api';

export const App: React.FC = () => {
  const [movieTitle, setMovieTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie>();
  const [movies, setMovies] = useState<Movie[]>([]);

  const [addError, setAddError] = useState<boolean>(false);
  const [isFound, setIsFound] = useState<boolean>(true);
  const [noMovieError, setNoMovieError] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFound(true);
    setMovieTitle(event.target.value);
  };

  const handleGetMovies = async () => {
    setIsLoading(true);
    const response = await movieFromServer(movieTitle);

    if (response.Response !== 'False') {
      setIsFound(true);
      setNoMovieError(false);
      setAddError(false);

      setMovie(response);
    } else {
      setIsFound(false);
      setMovie(undefined);
      setNoMovieError(false);
    }

    setIsLoading(false);
  };

  const addMovie = () => {
    const checkRepeat: boolean = movies.some(film => film.imdbID === movie?.imdbID);

    if (checkRepeat) {
      setMovie(undefined);
      setAddError(true);

      return;
    }

    if (movie) {
      setAddError(false);
      setNoMovieError(false);
      setMovies([...movies, movie]);
    } else {
      setNoMovieError(true);
    }

    setMovie(undefined);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          movie={movie}
          handleTitle={handleTitle}
          handleGetMovies={handleGetMovies}
          addMovie={addMovie}
          addError={addError}
          isFound={isFound}
          isLoading={isLoading}
          noMovieError={noMovieError}
        />
      </div>
    </div>
  );
};
