import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { findMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedMovie, selectMovie] = React.useState<Movie | null>(null);
  const [startSearch, setStartSearch] = useState(false);

  const submitForm = async (title: string) => {
    const result = await findMovie(title);

    setStartSearch(true);
    selectMovie(result);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();
          submitForm(query);
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                required
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames(
                  'input',
                  { 'is-danger': startSearch && !selectedMovie },
                )}
                value={query}
                onChange={event => setQuery(event.target.value)}
              />
            </div>
          </label>

          {(startSearch && !selectedMovie)
          && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {selectedMovie && <MovieCard movie={selectedMovie} />}
        {(!selectedMovie && !startSearch) && (<div>Start search</div>)}
      </div>
    </>
  );
};
