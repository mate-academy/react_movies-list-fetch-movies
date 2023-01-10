import React, { useState } from 'react';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onFind: (value: string) => void;
  movie: Movie | null;
  onAdd: () => void;
  isLoading: boolean
};

export const FindMovie: React.FC<Props> = ({
  onFind, movie, onAdd, isLoading,
}) => {
  const [enteredValue, setEnteredValue] = useState('');
  const [attemptedSearch, setAttemptedSearch] = useState(false);

  const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputField = e.target as HTMLInputElement;

    setEnteredValue(inputField.value);
    setAttemptedSearch(false);
  };

  const addClickHandler = () => {
    onAdd();
    setEnteredValue('');
    setAttemptedSearch(false);
  };

  const submitHandler = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onFind(enteredValue);
    setAttemptedSearch(true);
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitHandler}>
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
              className="input is-dander"
              value={enteredValue}
              onChange={valueChangeHandler}
            />
          </div>

          {!movie && !isLoading && attemptedSearch && (
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
              className={
                classNames('button is-light', { 'is-loading': isLoading })
              }
              disabled={!enteredValue.trim()}
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
                onClick={addClickHandler}
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
