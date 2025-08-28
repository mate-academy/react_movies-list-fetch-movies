import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
type Props = {
  onMovieAdd: (movie: Movie) => void;
};

const DEFAULT_IMG_URL =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (errorMessage) {
      setErrorMessage(null);
    }

    setQuery(event?.target.value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getMovie(query.trim());

      if ('Error' in result) {
        setErrorMessage(result.Error);
        setMovie(null);
      } else {
        const movieInfo: Movie = {
          description: result.Plot,
          imdbId: result.imdbID,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imgUrl:
            !result.Poster || result.Poster === 'N/A'
              ? DEFAULT_IMG_URL
              : result.Poster,
          title: result.Title,
        };

        setMovie(movieInfo);
      }
    } catch {
      setErrorMessage('An error occurred while fetching the movie');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
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
              className={cn('input', { 'is-danger': errorMessage })}
              value={query}
              onChange={onQueryChange}
            />
          </div>

          {errorMessage && (
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query.trim()}
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
                  onMovieAdd(movie);
                  setMovie(null);
                  setQuery('');
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
