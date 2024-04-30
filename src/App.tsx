import { ChangeEvent, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';
import { formatMovie } from './utils/utils';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handlerChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setErrorMessage(false);
  };

  const handlerFindMovie = (movieQuery: string) => {
    setLoading(true);

    getMovie(movieQuery)
      .then((movieData: MovieData | ResponseError) => {
        if ('Error' in movieData) {
          setErrorMessage(true);

          return;
        }

        setCurrentMovie(formatMovie(movieData));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlerAddMovie = () => {
    if (
      currentMovie &&
      !movies.find(movie => movie.imdbId === currentMovie.imdbId)
    ) {
      setMovies(prev => [...prev, currentMovie]);
    }

    setCurrentMovie(null);
    setQuery('');
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          isLoading={loading}
          query={query}
          onChangeQuery={handlerChangeQuery}
          onFindMovie={handlerFindMovie}
          onAddMovie={handlerAddMovie}
          errorMessage={errorMessage}
          currentMovie={currentMovie}
        />
      </div>
    </div>
  );
};
