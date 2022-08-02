/* eslint-disable no-console */
import React, { useState } from 'react';
import classNames from 'classnames';

import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  setSelectedMovie: (movie: MovieData) => void;
};

export const FindMovie: React.FC<Props> = ({ setSelectedMovie }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [error, setError] = useState<boolean>(false);

  const sendRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const movieFromServer = await getMovie(input);

    if ('Error' in movieFromServer) {
      setError(true);
    } else {
      setMovie({
        Poster: movieFromServer.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : movieFromServer.Poster,
        Title: movieFromServer.Title,
        Plot: movieFromServer.Plot,
        imdbID: movieFromServer.imdbID,
        imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}/`,
      });
    }

    setIsLoading(false);
  };

  const addFilmHandler = () => {
    if (movie) {
      setSelectedMovie(movie);
    }

    setInput('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie">
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
              value={input}
              onChange={(event) => setInput(event.target.value)}
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
            {input
              ? (
                <button
                  data-cy="searchButton"
                  type="submit"
                  className={classNames(
                    'button', 'is-light', { 'is-loading': isLoading },
                  )}
                  onClick={(event) => sendRequest(event)}
                >
                  Find a movie
                </button>
              )
              : (
                <button
                  data-cy="searchButton"
                  type="submit"
                  className="button is-light is-Loading"
                  disabled
                >
                  Find a movie
                </button>
              )}
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addFilmHandler()}
              >
                Add to the list
              </button>
            )}
          </div>
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
