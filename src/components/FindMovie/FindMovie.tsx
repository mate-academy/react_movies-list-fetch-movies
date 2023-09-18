import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie | null) => void,
};

export const FindMovie: React.FC<Props> = ({
  addMovie,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [hasTitleError, setHasTitleError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasTitleError(false);
  };

  function handleFormSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(data => {
        if ('Title' in data) {
          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: (
              data.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : data.Poster
            ),
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          });
        }

        if ('Error' in data) {
          setHasTitleError(true);
        }
      })
      .catch(() => setHasTitleError(true))
      .finally(() => setIsLoading(false));
  }

  const clear = () => {
    setQuery('');
    setMovie(null);
  };

  const onAdd = () => {
    addMovie(movie);
    clear();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => handleFormSubmit(event)}
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
              className={cn(
                'input',
                {
                  'is-danger': hasTitleError,
                },
              )}
              value={query}
              onChange={handleTitleChange}
            />
          </div>

          {hasTitleError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div
            className="control"
          >
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button',
                'is-light',
                {
                  'is-loading': isLoading,
                },
              )}
            >
              {
                movie
                  ? 'Search again'
                  : 'Find a movie'
              }
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => onAdd()}
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
