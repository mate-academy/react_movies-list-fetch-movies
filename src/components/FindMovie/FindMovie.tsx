import React, { useState } from 'react';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  setInputValue: (inputValue: string) => void;
  inputValue: string;
  loadMovie: () => void;
  movie: Movie | null | undefined;
  setShowError: (show: boolean) => void;
  showError: boolean;
  showLoading: boolean;
  onAddMovie: () => void;
  setShowLoading: (show: boolean) => void;
  showMovie: boolean;
};

export const FindMovie: React.FC<Props> = ({
  inputValue,
  setInputValue,
  loadMovie,
  movie,
  showError,
  setShowError,
  showLoading,
  setShowLoading,
  onAddMovie,
  showMovie,
}) => {
  const [showBtnAddList, setShowBtnAddList] = useState<boolean>(false);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          loadMovie();
          setShowBtnAddList(true);
          setShowLoading(true);
        }}
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
              className="input is-danger"
              value={inputValue}
              onChange={({ target }) => {
                setInputValue(target.value);
                setShowError(false);
              }}
            />
          </div>

          {showError && (
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
              className={`button is-${showLoading ? 'loading' : 'light'}`}
              disabled={!inputValue}
            >
              Find a movie
            </button>
          </div>

          {showBtnAddList && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => onAddMovie()}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {showMovie && (
          <MovieCard
            movie={movie}
          />
        )}
      </div>
    </>
  );
};
