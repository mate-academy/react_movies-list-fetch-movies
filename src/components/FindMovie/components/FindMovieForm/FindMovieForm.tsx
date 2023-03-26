import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getMovie } from '../../../../api';
import { checkImageUrl } from '../../../../helpers';
import { OnChange, OnSumbit } from '../../../../types/events';
import { FindMovieProps } from '../../../../types/FindMovie';
import { Button } from '../../../Button';
import { Input } from '../../../Input';
import { LoadingError } from '../../../LoadingError';

import './FindMovie.scss';

export const FindMovieForm: React.FC<FindMovieProps> = memo(
  ({
    movie,
    setMovie,
    handleAddMovie,
  }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [hasLoadingError, setHasLoadingError] = useState(false);

    const isDisabled = useMemo(() => !query?.length, [query]);

    const handleOnChange:OnChange = useCallback(event => {
      if (hasError) {
        setHasError(false);
      }

      const { value } = event.target;

      setQuery(value);
    }, [hasError]);

    const handleOnSubmit:OnSumbit = useCallback(event => {
      event.preventDefault();

      setLoading(true);

      getMovie(query)
        .then((movieData) => {
          if ('imdbID' in movieData) {
            setMovie({
              title: movieData.Title,
              description: movieData.Plot,
              imgUrl: checkImageUrl(movieData.Poster),
              imdbId: movieData.imdbID,
              imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            });
          }

          if ('Error' in movieData) {
            setHasError(true);
          }
        })
        .catch(() => setHasLoadingError(true))
        .finally(() => setLoading(false));
    }, [query, hasError]);

    useEffect(() => {
      if (!movie) {
        setQuery('');
      }
    }, [movie]);

    return (
      <form className="find-movie" onSubmit={handleOnSubmit}>
        <div className="field">
          <Input
            value={query}
            id="movie-title"
            label="Movie title"
            dataCy="titleField"
            placeholder="Enter a title to search"
            hasError={hasError}
            onChange={handleOnChange}
          />
        </div>

        <div className="field is-grouped">
          <div className="control">
            <Button
              type="submit"
              loading={loading}
              dataCy="searchButton"
              className="is-light"
              disabled={isDisabled}
              content="Find a movie"
            />
          </div>

          {movie && (
            <div className="control">
              <Button
                type="button"
                dataCy="addButton"
                className="is-primary"
                content="Add to the list"
                onClick={handleAddMovie}
              />
            </div>
          )}
        </div>

        {hasLoadingError && (
          <LoadingError textError="movie" />
        )}
      </form>
    );
  },
);
