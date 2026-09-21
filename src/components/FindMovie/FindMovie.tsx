import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const normalizeMovie = (result: MovieData): Movie => ({
    title: result.Title,
    description: result.Plot,
    imgUrl:
      result.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : result.Poster,
    imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
    imdbId: result.imdbID,
  });

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          setLoading(true);

          getMovie(query.trim())
            .then(result => {
              if ('Error' in result) {
                setHasError(true);
              } else {
                setMovie(normalizeMovie(result));
              }
            })
            .finally(() => {
              setLoading(false);
            });
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
              className={cn('input', { 'is-danger': hasError })}
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
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
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
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
                onClick={() => {
                  onAdd(movie);
                  setQuery('');
                  setMovie(null);
                }}
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
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
