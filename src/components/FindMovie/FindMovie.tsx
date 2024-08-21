import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';
//import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

const DEFAULT_POSTER_URL =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

function isResponseError(
  data: MovieData | ResponseError,
): data is ResponseError {
  return (data as ResponseError).Response === 'False';
}

interface Props {
  addMovieToList: (movie: MovieData) => void;
  movies: MovieData[];
}

export const FindMovie: React.FC<Props> = ({ addMovieToList, movies }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [movie, setMovie] = React.useState<MovieData | null>(null);
  const [error, setError] = useState(false);

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) {
      setError(false);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const data = await getMovie(inputValue);

      if (isResponseError(data)) {
        setError(true);
      } else {
        const normalizedMovie: MovieData = {
          ...data,
          Poster: data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER_URL,
        };

        setMovie(normalizedMovie);
      }
    } catch (e) {
      setLoading(false);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOnclick = () => {
    const checkedMovies = movies.filter(item => item.imdbID === movie?.imdbID);

    if (!checkedMovies.length) {
      addMovieToList(movie as MovieData);
    }

    setMovie(null);
    setInputValue('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
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
              className={classNames('input', { 'is-danger': error })}
              value={inputValue}
              onChange={handleOnInputChange}
            />
          </div>
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can not find a movie with such a title
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
              disabled={!inputValue}
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
                onClick={handleOnclick}
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
