/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  searchMovieTitle: (title:string) => void;
  isMovieFound: boolean;
  foundedMovie: Movie | null;
  addToList: () => void;
};

export const FindMovie: React.FC<Props> = (
  {
    searchMovieTitle,
    isMovieFound,
    foundedMovie,
    addToList,
  },
) => {
  const [inputQuery, setInputQuery] = useState('');

  const handleInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const searchedTitle = e.target.value;

    setInputQuery(searchedTitle);
  };

  return (
    <>
      <form className="movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={handleInput}
            />
          </div>
          {!isMovieFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => searchMovieTitle(inputQuery)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundedMovie && <MovieCard movie={foundedMovie} />}
      </div>
    </>
  );
};
