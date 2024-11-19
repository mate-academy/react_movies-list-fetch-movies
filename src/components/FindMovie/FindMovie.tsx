import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  setMoviesList: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ setMoviesList }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notFount, setNotFound] = useState<ResponseError | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (query) {
      const formatedQuery = query.trim().toLowerCase();

      getMovie(formatedQuery)
        .then(responce => {
          if (Object.hasOwn(responce, 'Title')) {
            const {
              Title,
              Plot,
              Poster,
              imdbID,
            } = responce as MovieData;

            const imgUrl = Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster;

            const newMovie = {
              title: Title,
              imgUrl,
              imdbUrl: `https://www.imdb.com/title/${imdbID}`,
              imdbId: imdbID,
              description: Plot,
            };

            setMovie(newMovie);
            setNotFound(null);
          }

          if (Object.hasOwn(responce, 'Error')) {
            setNotFound(responce as ResponseError);
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleAddToList = (film: Movie) => {
    setMoviesList(film);
    setQuery('');
    setMovie(null);
  };

  const handleInputQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotFound(null);
    setQuery(event.target.value);
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
                'is-danger': notFount?.Error,
              })}
              value={query}
              onChange={(event) => handleInputQuery(event)}
            />
          </div>

          {notFount?.Error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
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
