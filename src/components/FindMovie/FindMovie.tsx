import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  setMuvies: (value: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ setMuvies }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [movie, setMuvie] = useState<Movie | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    getMovie(inputQuery).then((data) => {
      if ('Title' in data) {
        const img = data.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : data.Poster;

        setMuvie({
          title: data.Title,
          description: data.Plot,
          imgUrl: img,
          imdbId: data.imdbID,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        });
      } else {
        setError(true);
      }
    })
      .finally(() => setLoading(false));
  };

  const handleInput = () => {
    setError(false);
  };

  const addMuvies = () => {
    if (movie) {
      setMuvies(movie);
      setMuvie(null);
      setInputQuery('');
    }
  };

  const verifyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(e.target.value);
    setError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSubmit}
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={inputQuery}
              onClick={handleInput}
              onChange={verifyInput}
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
              disabled={!inputQuery}
              className={classNames('button is-light', {
                'is-loading': loading,
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
                onClick={addMuvies}
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
          {movie && (
            <MovieCard movie={movie} />
          )}
        </div>
      )}
    </>
  );
};
