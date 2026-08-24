import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';

type Props = { onSubmit: (data: { movie: Movie | null }) => void };

export const FindMovie: React.FC<Props> = ({ onSubmit }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();

    if (movie) {
      onSubmit({ movie });
    }

    setSearch('');
    setMovie(null);
    setHasError(false);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const result: MovieData | ResponseError = await getMovie(search);

    setIsLoading(false);

    if ('Title' in result) {
      setMovie({
        title: result.Title,
        description: result.Plot,
        imgUrl:
          result.Poster !== 'N/A'
            ? result.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
        imdbId: result.imdbID,
      });
    } else {
      setMovie(null);
      setHasError(true);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className={classNames('input', { 'is-danger': hasError })}
              value={search}
              onChange={event => {
                setSearch(event.target.value);
                setHasError(false);
              }}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={search.length === 0}
              onClick={handleSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
