import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie, MovieData, ResponseError } from '../../types';
import { isError } from '../../types/Guards';

interface Props {
  value: string;
  onChangeValue: (val: string) => void;
  movie: Movie | null;
  onChangeMovie: (mov: Movie) => void;
  onAdd: () => void;
}

export const FindMovie: React.FC<Props> = ({
  value,
  onChangeValue,
  movie,
  onChangeMovie,
  onAdd,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notFoundMovie, setNotFoundMovie] = useState<ResponseError | null>(
    null,
  );

  const handleFindingMovie = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setNotFoundMovie(null);
    setIsLoading(true);

    getMovie(value)
      .then(res => {
        if (!isError<MovieData>(res)) {
          const poster =
            res.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : res.Poster;

          onChangeMovie({
            title: res.Title,
            description: res.Plot,
            imgUrl: poster,
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
            imdbId: res.imdbID,
          });
        }

        if (isError<MovieData>(res)) {
          setNotFoundMovie(res);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const changeInputValue = (val: string) => {
    setNotFoundMovie(null);
    onChangeValue(val);
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
              className={cn('input', { 'is-danger': notFoundMovie !== null })}
              value={value}
              onChange={e => changeInputValue(e.target.value)}
            />
          </div>

          {notFoundMovie !== null && (
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
              disabled={!Boolean(value.trim())}
              onClick={handleFindingMovie}
            >
              Find a movie
            </button>
          </div>

          {movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        </div>
      )}
    </>
  );
};
