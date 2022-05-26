import React, { FormEvent, useCallback, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovieRequest } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const onFind = useCallback(() => {
    if (!query.trim()) {
      setErrorMessage('Please, fill correct');
    } else {
      const searchMovie = async () => {
        const result = await getMovieRequest(query);

        if (result.Response === 'True') {
          setMovie(result);
          setErrorMessage('');
        } else {
          setErrorMessage('Cant find a movie with this title');
        }
      };

      searchMovie();
    }
  }, [query]);

  const onFormAdd = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!errorMessage && movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  }, [movie, errorMessage]);

  return (
    <>
      <form
        onSubmit={onFormAdd}
        className="find-movie"
      >
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
                { 'is-danger': errorMessage.length },
              )}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setErrorMessage('');
              }}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onFind}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!!errorMessage.length}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={movie}
          />
        </div>
      )}
    </>
  );
};
