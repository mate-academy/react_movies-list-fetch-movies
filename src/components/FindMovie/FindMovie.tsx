import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

import { Movie } from '../../types/Movie';

type Props = {
  error: string | null;
  loadingData: boolean;
  addMovie?: Movie;
  findMovie: (movie: string) => void;
  addMovieToList: () => void;
  clearError: () => void;
};
export const FindMovie: React.FC<Props> = ({
  error,
  loadingData,
  addMovie,
  findMovie,
  addMovieToList,
  clearError,
}) => {
  const [title, setTitle] = useState('');
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    clearError();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('--------------');

    findMovie(title);
  };

  useEffect(() => {
    if (addMovie) {
      setTitle('');
    }
  }, [addMovie]);

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
              className={'input'}
              value={title}
              onChange={handleTitle}
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
              className={`button ${loadingData ? 'is-loading' : 'is-light'}`}
              disabled={title ? false : true}
            >
              Find a movie
            </button>
          </div>

          {/* <div className="control">
            {addMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToList}
              >
                Add to the list
              </button>
            )}
          </div> */}
        </div>
      </form>
      <div className="control">
        {addMovie && (
          <button
            data-cy="addButton"
            type="button"
            className="button is-primary"
            onClick={addMovieToList}
          >
            Add to the list
          </button>
        )}
      </div>
      {addMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={addMovie} />
        </div>
      )}
    </>
  );
};
