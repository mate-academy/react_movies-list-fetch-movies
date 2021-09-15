import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import propTypes from 'prop-types';
import { request } from '../../api/getApi';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie, addErrorMessage, getAddError }) => {
  const [title, getTitle] = useState('');
  const [api, getApi] = useState('');
  const [showErrorMessage, getErrorMessage] = useState(true);

  async function loadApi() {
    const loadingApi = await request(title);

    getApi(loadingApi);
    if (loadingApi.Response === 'False') {
      getErrorMessage(false);
    }
  }

  const movie = {
    title: api.Title,
    description: api.Plot,
    imgUrl: api.Poster,
    imdbId: api.imdbID,
    imdbUrl: `https://www.imdb.com/title/${api.imdbID}`,
  };

  const addMovieToMoviesList = () => {
    if (movie.title !== undefined) {
      addMovie(movie);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={event => event.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              onChange={(event) => {
                getTitle(event.target.value);
                getErrorMessage(true);
                getAddError(true);
              }}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classnames(showErrorMessage && addErrorMessage
                ? 'input'
                : 'input is-danger')}
            />
          </div>
          {showErrorMessage
            ? ''
            : (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
          {addErrorMessage
            ? ''
            : (
              <p className="help is-danger">
                Such a movie has already been added
              </p>
            )
          }
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={title
                ? loadApi
                : null}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToMoviesList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <div className="container">
        {movie.title
          && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
          )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: propTypes.func.isRequired,
  getAddError: propTypes.func.isRequired,
  addErrorMessage: propTypes.bool.isRequired,
};
