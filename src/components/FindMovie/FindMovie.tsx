import React, { FormEvent, useCallback, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  addToList: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ addToList }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<ResponseError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  const handleSearchSubmit = useCallback(async () => {
    try {
      setLoading(true);

      const movieData = await getMovie(query);

      if ('Error' in movieData) {
        setError(movieData);
        setMovie(null);
      } else {
        const {
          Title,
          Plot,
          Poster,
          imdbID,
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
      setLoading(false);
    }
  }, [query]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(null);
  };

  const buttonDisabled = () => query === '';

  const addMovie = (movies: Movie) => {
    if (movies !== null) {
      addToList(movies);
      setQuery('');
      setMovie(null);
    }
  };

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
              onChange={handleQueryChange}
            />
          </div>

          {error && (
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              onClick={handleSearchSubmit}
              disabled={buttonDisabled()}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
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
