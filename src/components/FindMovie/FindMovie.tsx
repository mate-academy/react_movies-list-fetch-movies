import React, {
  FC,
  ChangeEvent,
  useState,
  FormEvent,
} from 'react';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';

import { MovieForApp } from '../../constants/types';
import { imdbUrl } from '../../constants/api';
import { loadMovie } from '../../utils/movies';
import './FindMovie.scss';

interface Props {
  onMovieAdd(newMovie: MovieForApp): void;
}


export const FindMovie: FC<Props> = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [movie, setMovie] = useState<MovieForApp | null>(null);
  const [isNoMovieFound, setNoMovieFound] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadError, setLoadError] = useState(false);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);

    if (isNoMovieFound) {
      setNoMovieFound(false);
    }
  };

  const searchForMovie = () => {
    setLoading(true);
    setLoadError(false);
    setNoMovieFound(false);

    loadMovie(inputValue)
      .then(data => {
        if (data.Response === 'False') {
          setNoMovieFound(true);

          return;
        }

        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = data;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbUrl: `${imdbUrl}/${imdbID}`,
          imdbId: imdbID,
        });
      })
      .catch(() => {
        setLoadError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    searchForMovie();
  };

  const onAddMovieButtonClick = () => {
    if (!movie) {
      return;
    }

    const { onMovieAdd } = props;

    onMovieAdd(movie);

    setInputValue('');
    setMovie(null);
  };

  const inputClassName = classNames(
    'input',
    { 'is-danger': isNoMovieFound },
  );

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onFormSubmit}
      >
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              value={inputValue}
              onChange={onInputChange}
              id="movie-title"
              placeholder="Enter a title to search"
              className={inputClassName}
            />
          </div>

          {isNoMovieFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {isLoadError && (
            <p className="help is-danger">
              Something went wrong. Please try again later
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={searchForMovie}
              disabled={isLoading || !inputValue}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={onAddMovieButtonClick}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
