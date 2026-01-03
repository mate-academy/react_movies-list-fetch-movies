import { useMemo, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [query, setQuery] = useState<string>('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function resetForm() {
    setQuery('');
    setMovieData(null);
  }

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(false);
  };

  const handleSubmit = useMemo(() => {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (query) {
        setIsLoading(true);

        getMovie(query)
          .then(result => {
            if ('Error' in result && result.Response === 'False') {
              setError(true);
              setMovieData(null);
            } else {
              setMovieData(result as MovieData);
            }
          })
          .catch(() => {
            setError(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };
  }, [query]);

  const addMovie = useMemo(() => {
    return (newMovie: Movie) => {
      if (movies.find(movie => movie.imdbId === newMovie.imdbId)) {
        resetForm();

        return;
      }

      setMovies(prevMovies => [...prevMovies, newMovie]);

      resetForm();
    };
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onInputChange={handleQueryChange}
          onSubmit={handleSubmit}
          query={query}
          isError={error}
          isLoading={isLoading}
          movieData={movieData}
          onAdd={addMovie}
        />
      </div>
    </div>
  );
};
