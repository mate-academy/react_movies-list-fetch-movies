import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [findMovie, setFindMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!query) {
      return;
    }

    let isCurrent = true;

    setIsLoading(true);

    getMovie(query)
      .then(data => {
        if (isCurrent) {
          setFindMovie(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!isCurrent) {
          return;
        }

        if (err instanceof Error) {
          if (err.message === 'Movie not found!') {
            setError("Can't find a movie with such a title");
          } else {
            setError('Произошла ошибка при загрузке данных');
          }
        } else {
          setError('Произошла непредвиденная ошибка');
        }

        setFindMovie(null);
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [query, counter]);

  // helper for added the movie to Array movies(only dublicate)
  const handleAddMovie = (newMovie: Movie) => {
    setMovies(prevMovies => {
      const existingMovie = prevMovies.find(
        movie => movie.imdbId === newMovie.imdbId,
      );

      if (existingMovie) {
        setFindMovie(null);

        return prevMovies;
      }

      return [...prevMovies, newMovie];
    });
  };

  const handleSearch = (text: string) => {
    setQuery(text);
    setCounter(prev => prev + 1);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          findMovie={findMovie}
          setFindMovie={setFindMovie}
          addMovie={handleAddMovie}
          onSearch={handleSearch}
          error={error}
          setError={setError}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
