import {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useState,
} from 'react';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { normalizeMovieData } from './helper';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';

type FindMovieProps = {
  setMovies: Dispatch<SetStateAction<Movie[]>>;
};

export const FindMovie = ({ setMovies }: FindMovieProps) => {
  const [movieInput, setMovieInput] = useState('');
  const [tempMovie, setTempMovie] = useState<Movie | null>(null);
  const [movieError, setMovieError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    getMovie(movieInput)
      .then((data) => {
        if (data.Response === 'False') {
          setMovieError(true);
        } else {
          setTempMovie(normalizeMovieData(data as MovieData));
        }
      })
      .finally(() => setLoading(false));
  };

  const addMovie = () => {
    if (tempMovie) {
      setMovies((prevState) => {
        if (
          !prevState.some((prevMovie) => prevMovie.imdbId === tempMovie.imdbId)
        ) {
          return [...prevState, tempMovie];
        }

        return prevState;
      });
    }

    setTempMovie(null);
    setMovieInput('');
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
              className={classNames('input', { 'is-danger': movieError })}
              onChange={(e) => {
                setMovieError(false);
                setMovieInput(e.target.value);
              }}
              value={movieInput}
            />
          </div>

          {movieError && (
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
                'is-loading': loading,
              })}
              disabled={!movieInput}
            >
              Find a movie
            </button>
          </div>

          {tempMovie && (
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

      {tempMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={tempMovie} />
        </div>
      )}
    </>
  );
};
