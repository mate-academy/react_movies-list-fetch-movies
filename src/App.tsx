import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieFound, setIsMovieFound] = useState(false);

  const resetForm = useCallback(() => {
    setMovie(null);
    setQuery('');
    setIsMovieFound(false);
    setHasError(false);
  }, []);

  const handleAddMovie = (movieToAdd: Movie | null) => {
    if (movieToAdd) {
      const isAlreadyAdded = movies
        .find(movieToCheck => movieToCheck.imdbId === movieToAdd.imdbId);

      if (!isAlreadyAdded) {
        setMovies(prevMovies => [...prevMovies, movieToAdd]);
      }

      resetForm();
    }
  };

  const handleFindMovie: React.FormEventHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(response => {
        if ('imdbID' in response) {
          const {
            Title, Plot, Poster, imdbID,
          } = response;

          const foundMovie = {
            title: Title,
            description: Plot,
            imgUrl: Poster !== 'N/A'
              ? Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: imdbID,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          };

          setIsMovieFound(true);

          setMovie(foundMovie);
        } else {
          setHasError(true);
        }
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={movie}
          addMovie={handleAddMovie}
          isMovieFound={isMovieFound}
          hasError={hasError}
          setHasError={setHasError}
          isLoading={isLoading}
          query={query}
          setQuery={setQuery}
          onFormSubmit={handleFindMovie}
        />
      </div>
    </div>
  );
};
