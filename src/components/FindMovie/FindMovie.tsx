import classNames from 'classnames';
import React, { useState } from 'react';
import './FindMovie.scss';

type Props = {
  hasFound: boolean | null,
  findMovie: (name: string) => void,
  onAdd: () => void,
};

export const FindMovie: React.FC<Props> = ({ hasFound, findMovie, onAdd }) => {
  const [query, setQuery] = useState('');
  const [hasAdd, setHasAdd] = useState(false);

  const handleClickFind = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    findMovie(query);
    setQuery('');
    setHasAdd(false);
  };

  const handleClickAdd = () => {
    onAdd();
    setHasAdd(true);
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
              className={classNames(
                'input',
                { 'is-success': hasFound !== null && hasFound },
                { 'is-danger': hasFound !== null && !hasFound },
              )}
              value={query}
              onChange={handleClickFind}
            />
          </div>

          {hasFound !== null && !hasFound && (
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
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {hasFound && !hasAdd && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleClickAdd}
              >
                Add to the list
              </button>
            )}
            {hasFound && hasAdd && (
              <button
                type="button"
                className="button is-success"
                title="Disabled button"
                disabled
              >
                <span>Added</span>
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
      </div>
    </>
  );
};
