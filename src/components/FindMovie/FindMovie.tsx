import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  setMoviesToList: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ setMoviesToList }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotfound, setIsNotFound] = useState<ResponseError | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleInputQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNotFound(null);

    setQuery(event.target.value);
  };

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (query) {
      const preparedQuery = query.trim().toLocaleLowerCase();

      getMovie(preparedQuery)
        .then(response => {
          if (Object.hasOwn(response, 'Title')) {
            const {
              Poster,
              Title,
              Plot,
              imdbID,
            } = response as MovieData;

            const imgUrl = Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster;

            const newMovie = {
              title: Title,
              description: Plot,
              imgUrl,
              imdbUrl: `https://www.imdb.com/title/${imdbID}`,
              imdbId: imdbID,
            };

            setMovie(newMovie);
            setIsNotFound(null);
          }

          if (Object.hasOwn(response, 'Error')) {
            setIsNotFound(response as ResponseError);
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleAddToList = (film: Movie) => {
    setMoviesToList(film);
    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleOnSubmit}
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
              className={classNames('input', {
                'is-danger': isNotfound?.Error,
              })}
              value={query}
              onChange={(e) => handleInputQuery(e)}
            />
          </div>

          {isNotfound?.Error && (
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
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddToList(movie)}
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
