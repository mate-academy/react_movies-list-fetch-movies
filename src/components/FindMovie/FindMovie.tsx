import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

const DEFAULT_ANSWER = 'N/A';
const DEFAULT_IMG_URL =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  onMovieAdd: (movie: Movie) => void;
};

export const FindMovie = ({ onMovieAdd }: Props) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFindingError, setIsFindingError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsFindingError(false);
  };

  const handleFilmFinding = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then(result => {
        if ('Error' in result) {
          setIsFindingError(true);

          return;
        }

        setIsFindingError(false);
        setMovie({
          title: result.Title,
          description: result.Plot === DEFAULT_ANSWER ? '' : result.Plot,
          imgUrl:
            result.Poster === DEFAULT_ANSWER ? DEFAULT_IMG_URL : result.Poster,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleMovieAdding = () => {
    if (movie === null) {
      return;
    }

    onMovieAdd(movie);
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie">
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
                'is-danger': isFindingError,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {isFindingError && (
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
                'is-loading': isLoading,
              })}
              onClick={handleFilmFinding}
              disabled={query.trim().length === 0}
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
                onClick={handleMovieAdding}
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
