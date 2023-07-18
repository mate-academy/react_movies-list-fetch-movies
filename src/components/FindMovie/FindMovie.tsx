import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  formInput: string,
  onChangeInput: (value: string) => void,
  onMoviesQuery: () => void,
  movie: null | Movie,
  setMovie: React.Dispatch<React.SetStateAction<Movie | null>>,
  setAllMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
  allMovies: Movie[],
  loading: boolean,
};

export const FindMovie: React.FC<Props> = ({
  formInput,
  onChangeInput,
  onMoviesQuery,
  movie,
  setMovie,
  setAllMovies,
  allMovies,
  loading,
}) => {
  const [touched, setTouched] = useState(false);

  const addMoviesHandle = () => {
    if (!allMovies.find((el) => el.title === movie?.title)) {
      setAllMovies((prev) => (movie ? [...prev, movie] : prev));
    }

    setMovie(null);
    onChangeInput('');
    setTouched(false);
  };

  const finedHandler = () => {
    setTouched(true);
    onMoviesQuery();
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={(e) => e.preventDefault()}>
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
                'is-danger': !movie && touched && !loading,
              })}
              value={formInput}
              onChange={(e) => {
                onChangeInput(e.target.value);
                setTouched(false);
              }}
            />
          </div>

          {!movie && touched && !loading && (
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
              className={classNames('button', 'is-light',
                { 'is-loading': loading })}
              disabled={!formInput.trim()}
              onClick={() => finedHandler()}
            >
              {!touched ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMoviesHandle()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
