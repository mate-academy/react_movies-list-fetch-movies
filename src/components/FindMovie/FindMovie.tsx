import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFindMovie = () => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);

    getMovie(query.trim())
      .then((value: MovieData | ResponseError) => {
        setHasError(false);
        setMovie(null);
        if ('Error' in value) {
          setHasError(true);
        } else {
          setMovie({
            title: value.Title,
            description: value.Plot,
            imgUrl:
              value.Poster !== 'N/A'
                ? value.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: value.imdbID,
            imdbUrl: `https://www.imdb.com/title/${value.imdbID}`,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    setHasError(false);
    if (movie) {
      onAddMovie(movie);
    }

    setQuery('');
    setMovie(null);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();
          handleFindMovie();
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={event => handleQueryChange(event)}
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
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={!query.length}
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
