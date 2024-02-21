/* eslint-disable @typescript-eslint/no-shadow */
import React, { ChangeEvent, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

interface FindMovieProps {
  addToList: (item: Movie) => void
}

export const FindMovie: React.FC<FindMovieProps> = ({ addToList }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<null | Movie>();
  const [isLoading, setIsLoading] = useState(false);

  function inputHandler(event: ChangeEvent<HTMLInputElement>) {
    setError(false);
    setQuery(event.target.value);
  }

  const findMovieHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await getMovie(query);

      if ('Error' in data || query.trim() === '') {
        setError(true);
        setMovie(null);
      } else {
        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = data;

        const processedData = {
          title: Title,
          description: Plot,
          imgUrl: Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovie(processedData);
        setError(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  function addMovieHandler() {
    if (movie) {
      addToList(movie);

      setQuery('');
      setError(false);
      setMovie(null);
      setIsLoading(false);
    }
  }

  return (
    <>
      <form className="find-movie" onSubmit={findMovieHandler}>
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
              className={classNames('input', { 'is-danger': error === true })}
              value={query}
              onChange={(value) => inputHandler(value)}
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
              disabled={query.length <= 0}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {(movie && !error) && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieHandler}
              >
                Add to the list
              </button>
            </div>
          ) }

        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movie && <MovieCard movie={movie} />}
        </div>
      )}

    </>
  );
};
