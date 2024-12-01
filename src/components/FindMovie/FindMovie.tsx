import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (prediction: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({
  addMovie,
}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Movie>();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setQuery(event.target.value);
  };

  const handleFindMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setLoading(true);

    getMovie(query)
      .then((response) => {
        if ('Error' in response) {
          setError(true);
        } else {
          const {
            Title: title,
            Plot: description,
            Poster: imgUrl,
            imdbID: imdbId,
          } = response;
          const imdbUrl = `https://www.imdb.com/title/${response.imdbID}`;

          setPrediction({
            title,
            description,
            imgUrl: imgUrl === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : imgUrl,
            imdbUrl,
            imdbId,
          });
        }
      }).finally(() => {
        setLoading(false);
        setQuery('');
      });
  };

  const addMovieHandler = () => {
    if (prediction) {
      addMovie(prediction);

      setPrediction(undefined);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFindMovie}>
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
              value={query}
              onChange={handleInputChange}
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
              className={cn('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {!!prediction && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieHandler}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {!!prediction && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={prediction} />
        </div>
      )}

    </>
  );
};
