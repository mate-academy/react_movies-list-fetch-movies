import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { normalizeMovieData } from '../../utils/normalizeMovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie>();
  const [query, changeQuery] = useState('');
  const [hasError, changeErrorStatus] = useState(false);
  const [isLoading, changeLoadingStatus] = useState(false);

  const handleQuery = (value: string) => {
    changeQuery(value);
    changeErrorStatus(false);
  };

  const handleMovie = async () => {
    changeLoadingStatus(true);

    try {
      const result = await getMovie(query);

      if ((result as MovieData).Title) {
        setMovie(normalizeMovieData(result as MovieData));
        changeErrorStatus(false);
      } else {
        changeErrorStatus(true);
      }
    } catch (error) {
      changeErrorStatus(true);
    } finally {
      changeLoadingStatus(false);
    }
  };

  const addMovie = ():void => {
    onAdd(movie as Movie);
    changeQuery('');
    setMovie(undefined);
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
              className="input is-dander"
              value={query}
              onChange={(event) => handleQuery(event.target.value)}
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
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              onClick={(event) => {
                event.preventDefault();
                handleMovie();
              }}
              disabled={!query}
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
                onClick={addMovie}
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
