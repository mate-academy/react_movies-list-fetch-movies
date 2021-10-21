import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import propTypes from 'prop-types';
import { request } from '../../api/getApi';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie, addErrorMessage, getAddError }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({});
  const [showErrorMessage, setErrorMessage] = useState(true);

  async function loadMovie() {
    const loadingApi = await request(title);

    setMovie(loadingApi);
    if (loadingApi.Response === 'False') {
      setErrorMessage(false);
    }
  }

  const film = {
    title: movie.Title,
    description: movie.Plot,
    imgUrl: movie.Poster,
    imdbId: movie.imdbID,
    imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
  };

  const addMovieToMoviesList = () => {
    if (film.title !== undefined) {
      addMovie(film);
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
                setTitle(event.target.value);
                setErrorMessage(true);
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
          {!showErrorMessage && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
          {!addErrorMessage && (
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
              onClick={loadMovie}
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
        {film.title
          && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...film} />
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
