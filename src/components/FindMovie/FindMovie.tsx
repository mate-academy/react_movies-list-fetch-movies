import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';
// import { ResponseError } from '../../types/ReponseError';

type Props = {
  query: string;
  setQuery: (newQuery: string) => void;
  movie: Movie | null;
  setMovie: (newMovie: Movie | null) => void;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  movie,
  setMovie,
  setMovies,
}) => {
  const DEFAULT_POSTER =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const [submitDone, setSubmitDone] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  function handleChangeQuery(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setHasError(false);
  }

  function normalizeMovie(data: MovieData): Movie | null {
    if (!data) {
      return null;
    }

    const title = data.Title && data.Title !== 'N/A' ? data.Title : '';
    const description = data.Plot && data.Plot !== 'N/A' ? data.Plot : '';
    const imgUrl =
      data.Poster && data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER;
    const imdbId = data.imdbID && data.imdbID !== 'N/A' ? data.imdbID : '';
    const imdbUrl = `https://www.imdb.com/title/${imdbId}`;

    if (!title || !imdbId) {
      return null;
    }

    return {
      title,
      description,
      imgUrl,
      imdbUrl,
      imdbId,
    };
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(data => {
        const normalized = normalizeMovie(data as MovieData);

        if (!normalized) {
          setHasError(true);
          setMovie(null);
        } else {
          setMovie(normalized);
          setHasError(false);
        }
      })
      .catch(() => setHasError(true))
      .finally(() => {
        setSubmitDone(true);
        setLoading(false);
      });
  }

  function handleOnAdd(newMovie: Movie) {
    if (newMovie) {
      setMovies((prev: Movie[]) =>
        prev.some(m => m.imdbId === newMovie.imdbId)
          ? prev
          : [...prev, newMovie],
      );

      setMovie(null);
      setQuery('');
      setSubmitDone(false);
    }
  }

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
              className={classNames('input', hasError ? 'is-danger' : '')}
              value={query}
              onChange={handleChangeQuery}
            />
          </div>
          {hasError && (
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
                'button is-light',
                loading ? 'is-loading' : '',
              )}
              disabled={query === ''}
            >
              {/* {loading && (
                <div className="is-loading">
                  <div className="is-loading__content" />
                </div>
              )} */}
              {submitDone ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {submitDone && !hasError && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleOnAdd(movie!)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie !== null && (
        <>
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        </>
      )}
    </>
  );
};
