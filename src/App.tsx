import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (isSubmitted && query.length) {
      getMovie(query)
        .then((movieFromServer) => {
          if (isMovieData(movieFromServer)) {
            setMovie({
              title: movieFromServer.Title,
              description: movieFromServer.Plot,
              imgUrl:
                movieFromServer.Poster !== 'N/A'
                  ? movieFromServer.Poster
                  : 'https://via.placeholder.com/360x270.png?text=no%20preview',
              imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
              imdbId: movieFromServer.imdbID,
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
    }
  }, [isSubmitted]);

  return (
    <div className="page">
      <div className="page-content">
        {movies.length > 0 && (
          <MoviesList movies={movies} />
        )}
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          setQuery={setQuery}
          movie={movie}
          setMovie={setMovie}
          movies={movies}
          setMovies={setMovies}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          showError={showError}
          setShowError={setShowError}
        />
      </div>
    </div>
  );
};
