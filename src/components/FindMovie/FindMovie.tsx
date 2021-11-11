import React, { useState } from 'react';

import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  addToTheList: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addToTheList }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const sendRequest = async () => {
    const movieFromServer = await getMovie(title);

    if (movieFromServer.Title) {
      return setMovie(movieFromServer);
    }

    return setError(current => !current);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input"
                value={title}
                onChange={(event) => {
                  setError(false);
                  setTitle(event.target.value);
                }}
              />
            </div>
          </label>

          {error && (
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
              onClick={sendRequest}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  addToTheList(movie);
                  setTitle('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard
            movie={movie}
          />
        )}
      </div>
    </>
  );
};
