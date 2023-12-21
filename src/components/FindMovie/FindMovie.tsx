import React, {
  ChangeEvent, FormEvent, useState,
} from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  addFoundMovie: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addFoundMovie }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const inputValue = event.target.value;

    const value = inputValue.trimStart();

    setQuery(value);
  };

  const resetSearchBar = () => {
    setQuery('');
    setMovie(null);
  };

  const handleAddMovie = () => {
    if (movie) {
      addFoundMovie(movie);
    }

    resetSearchBar();
  };

  const handleSUbmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then((response : (MovieData | ResponseError)) => {
        if ('Response' in response) {
          setError(response.Error);
        }

        if ('imdbID' in response) {
          const {
            Poster, Title, Plot, imdbID,
          } = response;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster
            || 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSUbmit}>
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={query}
              onChange={handleChange}
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
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
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
