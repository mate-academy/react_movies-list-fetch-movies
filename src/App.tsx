import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

import { getMovie } from './api';

export const App = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const isMovieData = (data: MovieData | ResponseError): data is MovieData => {
    return (data as MovieData).Title !== undefined;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitted(true);
    getMovie(query)
      .then((movieFromServer) => {
        if (isMovieData(movieFromServer)) {
          const {
            Title, Plot, Poster, imdbID,
          } = movieFromServer;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl:
              Poster !== 'N/A'
                ? Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
          setShowError(false);
        } else {
          setShowError(true);
        }
      })
      .catch(() => {
        setShowError(true);
      })
      .finally(() => {
        setIsSubmitted(false);
      });
  };

  const handleAdd = () => {
    if (movie) {
      setMovies([...movies, movie]);

      if (movies.length
        && movies.some(({ imdbId }) => movie.imdbId === imdbId)) {
        setMovies(movies);
      }
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        {!!movies.length && (
          <MoviesList movies={movies} />
        )}
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          setQuery={setQuery}
          movie={movie}
          isSubmitted={isSubmitted}
          showError={showError}
          setShowError={setShowError}
          handleAdd={handleAdd}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
