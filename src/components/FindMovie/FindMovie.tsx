import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  movie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movie }) => {
  const [query, setQuery] = useState('');
  const [find, setFind] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const heandleMovieSerch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    if (error) {
      setError(false);
    }
  };

  function heandleAddMovie() {
    if (find) {
      movie(find);
      setFind(null);
      setQuery('');
    }
  }

  const heandleForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(result => {
        if ('Error' in result) {
          setError(true);
        } else {
          const newMovie = {
            title: result.Title,
            description: result.Plot,
            imgUrl:
              result.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : result.Poster,
            imdbUrl: 'https://www.imdb.com/title/' + result.imdbID,
            imdbId: result.imdbID,
          };

          setFind(newMovie);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form className="find-movie" onSubmit={heandleForm}>
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
              value={query}
              onChange={heandleMovieSerch}
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          {find && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={heandleAddMovie}
                disabled={!query.trim()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {find && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={find} />
        </div>
      )}
    </>
  );
};
