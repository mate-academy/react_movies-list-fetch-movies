import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { ResponseError } from './types/ReponseError';
import { MovieData } from './types/MovieData';

const BASE_IMDB_URL = 'https://www.imdb.com/title/';

function isResponseError(
  data: MovieData | ResponseError,
): data is ResponseError {
  return (data as ResponseError).Error !== undefined;
}

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFindButtonTouched, setIsFindButtonTouched] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setIsError(false);
    },
    [],
  );

  const handleAddMovie = useCallback((movie: Movie) => {
    setMovies(currentMovies => {
      if (
        currentMovies.some(
          (el: Movie) => JSON.stringify(el) === JSON.stringify(movie),
        )
      ) {
        return [...currentMovies];
      }

      return [...currentMovies, movie];
    });
    setQuery('');
    setIsFindButtonTouched(false);
    setSelectedMovie(null);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>, queryToSearch: string) => {
      e.preventDefault();

      setIsLoading(true);
      getMovie(queryToSearch)
        .then(data => {
          if (isResponseError(data)) {
            setIsError(true);
          } else {
            setSelectedMovie({
              title: data.Title,
              description: data.Plot,
              imgUrl:
                data.Poster === 'N/A'
                  ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                  : data.Poster,
              imdbUrl: `${BASE_IMDB_URL}${data.imdbID}`,
              imdbId: data.imdbID,
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
          setIsFindButtonTouched(true);
        });
    },
    [],
  );

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          handleInputChange={handleInputChange}
          selectedMovie={selectedMovie}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          handleAddMovie={handleAddMovie}
          isError={isError}
          isFindButtonTouched={isFindButtonTouched}
        />
      </div>
    </div>
  );
};
