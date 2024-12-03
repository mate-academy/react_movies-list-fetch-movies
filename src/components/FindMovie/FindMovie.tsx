import classNames from 'classnames';
import debounce from 'lodash.debounce';
import React, { useMemo, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [value, setValue] = useState('');

  const isResponseError = (
    data: MovieData | ResponseError,
  ): data is ResponseError => {
    return (data as ResponseError).Error !== undefined;
  };

  const transformMovieData = (data: MovieData): Movie => {
    return {
      title: data.Title,
      description: data.Plot,
      imgUrl:
        data.Poster ||
        `https://via.placeholder.com/360x270.png?text=no%20preview`,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
      imdbId: data.imdbID,
    };
  };

  const applyQuery = useMemo(
    () =>
      debounce((currentQuery: string) => {
        setQuery(currentQuery);
      }, 500),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setValue(event.target.value);
    setErrorMessage('');
  };

  const handleFindMovie = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      getMovie(query)
        .then(data => {
          if (isResponseError(data)) {
            setErrorMessage(`Can\'t find a movie with such a title`);
          } else {
            setMovie(transformMovieData(data));
          }
        })
        .finally(() => setLoading(false));
    }, 500);
  };

  const handleAddMovie = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    if (movie) {
      onAdd(movie);
    }

    setMovie(null);
    setQuery('');
    setValue('');
  };

  return (
    <>
      <form className="find-movie">
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
              className={classNames('input', { 'is-danger': errorMessage })}
              value={value}
              onChange={handleQueryChange}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={loading || !query}
              onClick={handleFindMovie}
            >
              {(!movie && 'Find a movie') || 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
