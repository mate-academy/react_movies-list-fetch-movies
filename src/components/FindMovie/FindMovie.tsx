import React, {
  FormEvent, useCallback, useMemo, useState,
} from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  addToList: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addToList }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<ResponseError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  const handleSearchSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      const movieData = await getMovie(query);

      if ('Error' in movieData) {
        setError(movieData);
        setMovie(null);
      } else {
        const {
          Title, Plot, imdbID, Poster,
        } = movieData;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbId: imdbID,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        });

        setError(null);
      }
    } catch {
      setError({ Response: 'False', Error: 'unexpected error' });
      setMovie(null);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setError(null);
    },
    [],
  );

  const searchButtonDisabled = useMemo(() => query === '', [query]);

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error.Error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={handleSearchSubmit}
              disabled={searchButtonDisabled}
            >
              Find a movie
            </button>
          </div>

          {!!movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movie !== null) {
                    addToList(movie);
                    setQuery('');
                    setMovie(null);
                  }
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!!movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          movie &&
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
