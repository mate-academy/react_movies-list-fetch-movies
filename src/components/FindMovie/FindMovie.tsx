import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { transformMovieData } from '../../utils/transformMovieData';
import { MovieCard } from '../MovieCard';

interface IProps {
  addMovies: (movie: Movie) => void;
}

export const FindMovie: React.FC<IProps> = ({ addMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setLodating] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLodating(true);

      const res = await getMovie(title);

      if ('Title' in res) {
        setMovie(transformMovieData(res));
      }

      if ('Error' in res) {
        setError(res.Error);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLodating(false);
    }
  };

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
      if (error) {
        setError('');
      }
    },
    [error],
  );

  const reset = () => {
    setMovie(null);
    setTitle('');
    setError('');
  };

  const handleAddMovieToCard = () => {
    if (movie) {
      addMovies(movie);
      reset();
    }
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
              className={cn('input', {
                'is-danger': error,
              })}
              value={title}
              onChange={handleChange}
            />
          </div>

          {error && (
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
              className={cn('button', {
                'is-light': !isLoading,
                'is-loading': isLoading,
              })}
              disabled={!title}
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
                onClick={handleAddMovieToCard}
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
