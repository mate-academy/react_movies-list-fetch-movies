import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies:Movie[];
  onAddMovieToList: (query:Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({
  movies,
  onAddMovieToList,
}) => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [findMovie, setFindMovie] = useState<MovieData | null>(null);
  const [movieIsError, setMovieIsError] = useState<ResponseError | null>(null);

  const loadMovie = useCallback(
    async (query) => {
      setIsLoading(true);
      try {
        const movieFromServer = await getMovie(query);

        setIsLoading(false);
        if ('Error' in movieFromServer) {
          setMovieIsError(movieFromServer);
        } else {
          setFindMovie(movieFromServer);
        }
      } catch {
        setMovieIsError(null);
      } finally {
        setIsLoading(false);
      }
    }, [],
  );

  const normalizeMovie = useCallback(
    (movie:MovieData) => {
      return (
        {
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        }
      );
    }, [],
  );

  useEffect(() => {
    if (movieIsError && movieIsError.Response === 'False') {
      setMovieIsError(null);
    }
  }, [value]);

  return (
    <>
      <form
        method="get"
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();

          if (value.length > 0) {
            loadMovie(value);
          }
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          {movieIsError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={value.length === 0}
            >
              Find a movie
            </button>
          </div>
          {findMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  const movieInList = movies
                    .find(movie => movie.imdbId === findMovie.imdbID);

                  if (movieInList === undefined) {
                    onAddMovieToList(normalizeMovie(findMovie));
                  }

                  setFindMovie(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {findMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={normalizeMovie(findMovie)} />
        </div>
      )}
    </>
  );
};
