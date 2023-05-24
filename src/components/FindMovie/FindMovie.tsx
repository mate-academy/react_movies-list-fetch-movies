import { useState } from 'react';

import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

import { getMovie } from '../../api';
import { normalizeMovieData } from './helper';

import { Movie } from '../../types/Movie';

type FindMovieProps = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie = ({ onAdd }: FindMovieProps) => {
  const [movieInput, setMovieInput] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieError, setMovieError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    getMovie(movieInput)
      .then(data => {
        if (data.Response === 'True') {
          setMovie(normalizeMovieData(data));
        } else {
          setMovieError(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAdd = () => {
    if (movie) {
      onAdd(movie);
    }

    setMovie(null);
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
              className={
                classNames('input', { 'is-danger': movieError })
              }
              onChange={(e) => {
                setMovieError(false);
                setMovieInput(e.target.value);
              }}
              value={movieInput}
            />
          </div>

          {
            movieError && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={
                classNames('button', 'is-light', { 'is-loading': loading })
              }
              disabled={!movieInput}
            >
              Find a movie
            </button>
          </div>

          {
            movie && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handleAdd}
                >
                  Add to the list
                </button>
              </div>
            )
          }
        </div>
      </form>

      {
        movie && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )
      }
    </>
  );
};
