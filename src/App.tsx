import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api/MovieAPI';
import './App.scss';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [isMovieFound, setIsMovieFound] = useState(true);
  const [isServerError, setServerError] = useState(false);

  const searchMovieTitle = async (title:string) => {
    try {
      const movie = await getMovie(title);

      if (movie.Response === 'True') {
        setFoundMovie(movie);
        setIsMovieFound(true);
      } else {
        setIsMovieFound(false);
      }
    } catch (error) {
      setServerError(true);
    }
  };

  const addToList = () => {
    if (!foundMovie) {
      return;
    }

    if (movies.find(movie => movie.imdbID === foundMovie.imdbID)) {
      return;
    }

    setMovies([...movies, foundMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          searchMovieTitle={searchMovieTitle}
          isMovieFound={isMovieFound}
          foundedMovie={foundMovie}
          addToList={addToList}
        />

        {isServerError && <p>Server request failed. Please try again later.</p>}
      </div>
    </div>
  );
};
