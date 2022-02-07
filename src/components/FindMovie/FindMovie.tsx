/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (title: string) => void,
  addMovieToList: (movie: Movie) => void,
  movie: Movie | null,
  movieFound: boolean,
};

export const FindMovie: React.FC<Props> = ({
  addMovie,
  movie,
  addMovieToList,
  movieFound,
}) => {
  const [searchTitle, setSearchTitle] = useState('');

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearchTitle(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addMovie(searchTitle);

    setSearchTitle('');
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
              type="text"
              id="movie-title"
              value={searchTitle}
              onChange={handleSearchInput}
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>
          {!movieFound && (
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
              onClick={() => {
                if (movie !== null) {
                  addMovieToList(movie);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>

        )}
      </div>
    </>
  );
};
