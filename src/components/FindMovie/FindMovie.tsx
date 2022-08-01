import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    setError('');
  };

  const handleMovieAdd = () => {
    if (movie) {
      addMovie(movie);
    }

    setQuery('');
    setMovie(null);
  };

  const handleMovieSearch = async (event: FormEvent) => {
    event.preventDefault();

    const movieFromServer = await getMovie(query);

    if (!movieFromServer.Error) {
      setMovie(movieFromServer);
    } else {
      setError(movieFromServer.Error);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleMovieSearch}
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
              value={query}
              onChange={handleQueryChange}
              className={classNames(
                'input',
                {
                  'is-danger': error,
                },
              )}
            />
          </div>

          {error && (
            <p className="help is-danger">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
              disabled={!query}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={handleMovieAdd}
              data-cy="add"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
