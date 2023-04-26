import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { MovieCard } from '../MovieCard';

import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

import { getMovie } from '../../api';

type Props = {
  onAddMovie: (movie: Movie) => void,
  isInList: boolean,
  onSetInList: (value: boolean) => void,
};

export const FindMovie: React.FC<Props> = ({
  onAddMovie,
  isInList,
  onSetInList,
}) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const changeMovieFormat = (fromFormat: MovieData | ResponseError) => {
    if ('Error' in fromFormat) {
      setIsError(true);

      return;
    }

    const toFormat = {
      title: fromFormat.Title,
      description: fromFormat.Plot,
      imgUrl: fromFormat.Poster !== 'N/A'
        ? fromFormat.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${fromFormat.imdbID}`,
      imdbId: fromFormat.imdbID,
    };

    setMovie(toFormat);
  };

  const handleChange = (e: React.BaseSyntheticEvent) => {
    if (isInList || isError) {
      onSetInList(false);
      setIsError(false);
    }

    setQuery(e.target.value);
  };

  const handleClick = () => {
    if (movie) {
      onAddMovie(movie);
      setQuery('');
      setMovie(null);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const data = await getMovie(query);

      changeMovieFormat(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetchData();
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
              className="input is-dander"
              value={query}
              onChange={handleChange}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {isInList && (
            <p className="help is-danger" data-cy="errorMessage">
              The movie already in the list
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={query === ''}
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
                onClick={handleClick}
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
