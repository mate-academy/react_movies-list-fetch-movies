import React, { useState } from 'react';
import './FindMovie.scss';

import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { createMovieItem } from '../../services/createMovieItem';
import { getNewMoveList } from '../../services/getNewMoveList';

type Props = {
  movies: Movie[]
  setMovies: (val: Movie[]) => void
};

export const FindMovie: React.FC<Props> = ({
  movies,
  setMovies = () => {},
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [errorData, setErrorData] = useState<ResponseError | null>(null);

  const movie = (movieData === null) ? null : createMovieItem(movieData);

  const handleMovieAdd = () => {
    if (movie) {
      setMovies(getNewMoveList(movie, movies));
      setMovieData(null);
      setInputValue('');
    }
  };

  const handleSubbmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (inputValue.trim().length > 0) {
      getMovie(inputValue)
        .then(res => ('Error' in res ? setErrorData(res) : setMovieData(res)))
        .finally(() => setIsLoading(false));
    }
  };

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (errorData) {
      setErrorData(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubbmit}
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
              className="input"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>

          {errorData !== null && (
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
              disabled={inputValue.length === 0}
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
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
                onClick={handleMovieAdd}
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
