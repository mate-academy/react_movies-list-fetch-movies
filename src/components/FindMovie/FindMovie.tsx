import React, { useState } from 'react';
import classNames from 'classnames';
import { loadMovies } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  getMovies: (movie: Movie) => void;
  onSetIsMovie: (argument: boolean) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { getMovies, onSetIsMovie } = props;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
  };

  const getMovie = async () => {
    onSetIsMovie(false);
    setLoading(true);

    try {
      const newMovie = await loadMovies(title);

      setLoading(false);

      if (!newMovie.Error) {
        const imdbUrl = `https://www.imdb.com/title/${newMovie.imdbID}`;

        setMovie({ ...newMovie, imdbUrl });
      } else {
        setMovie(null);
        setError(true);
      }
    } catch {
      setLoading(false);
      setMovie(null);
    }
  };

  const onAddMovies = () => {
    if (movie) {
      getMovies(movie);
      setMovie(null);
    }
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                'is-info', {
                  'is-danger': error,
                },
              )}
              value={title}
              onChange={handleChange}
            />
          </div>
          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames(
                'button',
                'is-light', {
                  'is-loading': loading,
                },
              )}
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={error}
              onClick={onAddMovies}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        )}
      </div>
    </>
  );
};
